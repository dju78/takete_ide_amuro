import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { decideVerification, OPEN_PROVIDER_STATUSES } from "@/lib/payments/verification";
import { paymentEventKey, toMajor, toMinor } from "@/lib/payments/constants";
import { resolveCallbackOrigin, resolveCallbackUrl } from "@/lib/payments/callback-url";

/**
 * The rules that decide whether money is treated as received, and the rules that
 * decide where a payer is sent afterwards.
 *
 * These run as real executions rather than assertions about source text, which
 * is why the decision logic was lifted out of the database code: a short
 * payment, a swapped currency and a mismatched reference are the cases that must
 * never silently start passing.
 */

const EXPECTED = { reference: "TIPU-ABC123", amountMinor: 500_000, currency: "NGN" };

function provider(overrides: Partial<typeof EXPECTED> & { status?: string } = {}) {
  return {
    reference: EXPECTED.reference,
    status: "success",
    amountMinor: EXPECTED.amountMinor,
    currency: EXPECTED.currency,
    ...overrides,
  };
}

test.describe("Amount handling", () => {
  test("naira converts to kobo as an integer", () => {
    expect(toMinor(5000)).toBe(500_000);
    expect(toMinor(100)).toBe(10_000);
    // Float naira must not leak fractional kobo into the provider request.
    expect(toMinor(4999.99)).toBe(499_999);
    expect(Number.isInteger(toMinor(0.1 + 0.2))).toBe(true);
  });

  test("kobo converts back to naira", () => {
    expect(toMajor(500_000)).toBe(5000);
    expect(toMajor(toMinor(2500))).toBe(2500);
  });
});

test.describe("Verification decides settlement", () => {
  test("an exact match settles", () => {
    expect(decideVerification({ expected: EXPECTED, provider: provider() })).toEqual({
      kind: "settle",
    });
  });

  test("a short payment does not settle", () => {
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ amountMinor: 100_000 }),
    });
    expect(decision.kind).toBe("amount_mismatch");
  });

  test("an overpayment does not settle silently either", () => {
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ amountMinor: 900_000 }),
    });
    expect(decision.kind).toBe("amount_mismatch");
  });

  test("the same number in a different currency does not settle", () => {
    // 500000 kobo and 500000 of a cheaper unit are not the same contribution.
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ currency: "USD" }),
    });
    expect(decision.kind).toBe("amount_mismatch");
  });

  test("a response for another transaction is never applied to this row", () => {
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ reference: "TIPU-SOMEONE-ELSE" }),
    });
    expect(decision).toEqual({ kind: "reference_mismatch" });
  });

  test("reference is checked before amount, so a matching amount cannot rescue it", () => {
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ reference: "TIPU-OTHER", status: "success" }),
    });
    expect(decision.kind).toBe("reference_mismatch");
  });

  test("a failed transaction does not settle", () => {
    expect(decideVerification({ expected: EXPECTED, provider: provider({ status: "failed" }) })).toEqual(
      { kind: "closed", status: "failed" },
    );
  });

  test("an abandoned transaction is recorded as abandoned, not failed", () => {
    expect(
      decideVerification({ expected: EXPECTED, provider: provider({ status: "abandoned" }) }),
    ).toEqual({ kind: "closed", status: "abandoned" });
  });

  test("an in-flight transaction stays pending rather than failing", () => {
    // Telling someone a payment failed while their bank transfer is still in
    // flight invites a second payment.
    for (const status of OPEN_PROVIDER_STATUSES) {
      expect(
        decideVerification({ expected: EXPECTED, provider: provider({ status }) }),
        `${status} must remain open`,
      ).toEqual({ kind: "open", status: "pending" });
    }
  });

  test("an unrecognised status is treated as failure, not success", () => {
    const decision = decideVerification({
      expected: EXPECTED,
      provider: provider({ status: "something_new" }),
    });
    expect(decision.kind).toBe("closed");
    expect(decision).not.toEqual({ kind: "settle" });
  });

  test("only an exact success settles — nothing else in the matrix does", () => {
    const statuses = ["failed", "abandoned", "reversed", "ongoing", "pending", "processing", ""];
    for (const status of statuses) {
      const decision = decideVerification({ expected: EXPECTED, provider: provider({ status }) });
      expect(decision.kind, `${status} must not settle`).not.toBe("settle");
    }
  });
});

test.describe("Webhook idempotency key", () => {
  test("is namespaced by provider and includes event type, transaction id and reference", () => {
    expect(
      paymentEventKey({ eventType: "charge.success", transactionId: 302961, reference: "TIPU-ABC123" }),
    ).toBe("paystack:charge.success:302961:TIPU-ABC123");
  });

  test("a retried delivery produces an identical key", () => {
    const delivery = { eventType: "charge.success", transactionId: 302961, reference: "TIPU-ABC123" };
    expect(paymentEventKey(delivery)).toBe(paymentEventKey({ ...delivery }));
    // Retries may serialise the id differently; the key must not fork.
    expect(paymentEventKey({ ...delivery, transactionId: "302961" })).toBe(
      paymentEventKey(delivery),
    );
  });

  test("falls back to a stable key when data.id is absent", () => {
    for (const missing of [null, undefined, ""]) {
      expect(
        paymentEventKey({
          eventType: "charge.success",
          transactionId: missing,
          reference: "TIPU-ABC123",
        }),
      ).toBe("paystack:charge.success:TIPU-ABC123");
    }
  });

  test("distinct events and distinct transactions get distinct keys", () => {
    const keys = new Set([
      paymentEventKey({ eventType: "charge.success", transactionId: 1, reference: "TIPU-A" }),
      paymentEventKey({ eventType: "charge.success", transactionId: 2, reference: "TIPU-A" }),
      paymentEventKey({ eventType: "transfer.success", transactionId: 1, reference: "TIPU-A" }),
      paymentEventKey({ eventType: "charge.success", transactionId: 1, reference: "TIPU-B" }),
    ]);
    expect(keys.size).toBe(4);
  });

  test("no key ever contains 'undefined'", () => {
    const key = paymentEventKey({ eventType: "charge.success", reference: "TIPU-ABC123" });
    expect(key).not.toContain("undefined");
    expect(key).not.toContain("null");
  });

  test("the webhook reads no undocumented top-level event id", () => {
    const source = readFileSync(join(process.cwd(), "app/api/paystack/webhook/route.ts"), "utf8");
    expect(source).not.toMatch(/event\.id/);
    expect(source).toContain("paymentEventKey");
    // The transaction id comes from the documented data object.
    expect(source).toContain("data.id");
  });

  test("the database, not the application, is the final guard on replay", () => {
    const migration = readFileSync(
      join(process.cwd(), "supabase/migrations/0019_contributions.sql"),
      "utf8",
    );
    expect(migration).toMatch(/provider_event_id text not null unique/);
    expect(migration).toMatch(/reference text not null unique/);
  });

  test("settlement is a conditional write, so two deliveries cannot both settle", () => {
    const source = readFileSync(join(process.cwd(), "lib/payments/contributions.ts"), "utf8");
    // A callback and a webhook arriving together both call settleContribution;
    // the .neq guard is what makes the second a no-op at the database level.
    expect(source).toContain('.neq("status", "successful")');
    expect(source).toContain('if (contribution.status === "successful")');
  });
});

test.describe("Callback origin", () => {
  test("production uses the configured site origin over HTTPS", () => {
    const result = resolveCallbackOrigin({
      context: "production",
      siteUrl: "https://takete.netlify.app",
      nodeEnv: "production",
    });
    expect(result).toEqual({ ok: true, origin: "https://takete.netlify.app", source: "configured" });
  });

  test("a Netlify deploy preview returns to its own deploy origin", () => {
    const result = resolveCallbackOrigin({
      context: "deploy-preview",
      deployPrimeUrl: "https://deploy-preview-42--takete.netlify.app",
      siteUrl: "https://takete.netlify.app",
      nodeEnv: "production",
    });
    expect(result).toEqual({
      ok: true,
      origin: "https://deploy-preview-42--takete.netlify.app",
      source: "deploy",
    });
  });

  test("a branch deploy does the same", () => {
    const result = resolveCallbackOrigin({
      context: "branch-deploy",
      deployPrimeUrl: "https://feature-x--takete.netlify.app",
      siteUrl: "https://takete.netlify.app",
      nodeEnv: "production",
    });
    expect(result.ok && result.origin).toBe("https://feature-x--takete.netlify.app");
  });

  test("a preview with no deploy URL fails closed rather than falling back to production", () => {
    const result = resolveCallbackOrigin({
      context: "deploy-preview",
      deployPrimeUrl: "",
      siteUrl: "https://takete.netlify.app",
      nodeEnv: "production",
    });
    expect(result.ok).toBe(false);
  });

  test("localhost over HTTP is allowed in development only", () => {
    expect(
      resolveCallbackOrigin({ siteUrl: "http://localhost:3000", nodeEnv: "development" }),
    ).toEqual({ ok: true, origin: "http://localhost:3000", source: "development" });

    expect(
      resolveCallbackOrigin({ siteUrl: "http://127.0.0.1:3000", nodeEnv: "development" }).ok,
    ).toBe(true);

    expect(
      resolveCallbackOrigin({ siteUrl: "http://localhost:3000", nodeEnv: "production" }).ok,
    ).toBe(false);
  });

  test("HTTPS is required outside local development", () => {
    const result = resolveCallbackOrigin({
      siteUrl: "http://takete.netlify.app",
      nodeEnv: "production",
    });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toMatch(/HTTPS/i);
  });

  test("an unconfigured production deployment fails closed", () => {
    const result = resolveCallbackOrigin({ context: "production", nodeEnv: "production" });
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toMatch(/NEXT_PUBLIC_SITE_URL/);
  });

  test("there is no dead fallback domain anywhere in the payment path", () => {
    // The previous default returned payers to a domain the union has never
    // registered. Nothing in the payment path may name a fallback origin.
    for (const file of [
      "lib/payments/callback-url.ts",
      "lib/actions/contributions.ts",
      "app/support/payment/callback/route.ts",
    ]) {
      expect(readFileSync(join(process.cwd(), file), "utf8")).not.toContain("taketeideamuro.org");
    }
  });

  test("a garbled origin is rejected rather than passed to the provider", () => {
    for (const bad of ["not-a-url", "javascript:alert(1)", "ftp://takete.netlify.app", "//evil.test"]) {
      expect(resolveCallbackOrigin({ siteUrl: bad, nodeEnv: "production" }).ok, bad).toBe(false);
    }
  });

  test("the resolved URL points at our own callback path", () => {
    const result = resolveCallbackUrl({ siteUrl: "https://takete.netlify.app", nodeEnv: "production" });
    expect(result).toEqual({ ok: true, url: "https://takete.netlify.app/support/payment/callback" });
  });

  test("initialization is refused when no trusted origin exists", () => {
    const source = readFileSync(join(process.cwd(), "lib/actions/contributions.ts"), "utf8");
    const guard = source.indexOf("resolveCallbackUrl()");
    const pendingWrite = source.indexOf("createPendingContribution(");
    // Fail closed *before* a pending row is written, so a refused deployment
    // leaves no orphaned contribution behind.
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(pendingWrite);
  });

  test("the callback URL is never derived from a request header", () => {
    const source = readFileSync(join(process.cwd(), "lib/payments/callback-url.ts"), "utf8");
    expect(source).not.toMatch(/\bheaders\(\)/);
    expect(source).not.toMatch(/["']host["']/i);
    expect(source).not.toMatch(/x-forwarded-host/i);
  });
});

test.describe("Callback return redirect", () => {
  test("redirects with a relative Location, immune to a forged Host", async ({ request }) => {
    const res = await request.get("/support/payment/callback?reference=TIPU-NOT-REAL", {
      maxRedirects: 0,
      headers: { Host: "evil.example" },
    });
    expect(res.status()).toBe(303);
    const location = res.headers()["location"];
    expect(location).toBeTruthy();
    // Relative: no scheme, and not protocol-relative either.
    expect(location.startsWith("/")).toBe(true);
    expect(location.startsWith("//")).toBe(false);
    expect(location).not.toContain("evil.example");
    expect(location).not.toMatch(/^https?:/);
  });

  test("carries no secret or provider payload in the redirect query", async ({ request }) => {
    const res = await request.get("/support/payment/callback?reference=TIPU-NOT-REAL", {
      maxRedirects: 0,
    });
    const location = res.headers()["location"] ?? "";
    expect(location).not.toMatch(/sk_|pk_|signature|authorization|token|secret/i);
  });

  test("an unknown reference never redirects to success", async ({ request }) => {
    const res = await request.get("/support/payment/callback?reference=TIPU-NOT-REAL", {
      maxRedirects: 0,
    });
    expect(res.headers()["location"]).not.toContain("/success");
  });
});
