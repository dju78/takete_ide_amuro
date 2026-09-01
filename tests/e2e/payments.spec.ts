import { test, expect } from "@playwright/test";
import { createHmac } from "node:crypto";

/**
 * Payments.
 *
 * These run with Paystack unconfigured, which is the state the site is in today
 * and therefore the state that must be safe: the Support page has to keep
 * working, no empty checkout may be exposed, and no endpoint may crash or
 * accidentally acknowledge an event it did not verify.
 *
 * The webhook assertions exercise the security boundary directly — a forged
 * signature, a missing signature, and a well-formed one — because the signature
 * check is the only thing standing between a stranger's POST and a contribution
 * being marked paid.
 */

const WEBHOOK = "/api/paystack/webhook";

function signed(body: string, key: string) {
  return createHmac("sha512", key).update(body, "utf8").digest("hex");
}

test.describe("Support page — degrades safely without Paystack", () => {
  test("still renders and keeps Direct Bank Transfer available", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: "Support Takete-Ide", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Direct Bank Transfer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Takete Ide Progressive Union" })).toBeVisible();
    await expect(page.getByText("First Bank", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("2023263187", { exact: true }).first()).toBeVisible();
  });

  test("exposes no online checkout form on the public support page", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByLabel(/Contribution amount/)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Continue to secure payment/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Pay Online|Pay with Card|Donate Online/i })).toHaveCount(0);
  });

  test("keeps the beneficiary warning and the copy control", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/support");
    await expect(
      page.getByText(/confirm that your banking application displays .Takete Ide Progressive Union./),
    ).toBeVisible();
    await page.getByRole("button", { name: /Copy account number/ }).click();
    await expect(page.getByRole("button", { name: /Account number copied/ })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("2023263187");
  });

  test("never asks for card, PIN or OTP", async ({ page }) => {
    await page.goto("/support");
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.getByLabel(/card number|cvv|pin|otp/i)).toHaveCount(0);
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(text).not.toMatch(/tax deductible|tax-deductible/i);
  });
});

test.describe("Paystack webhook security", () => {
  test("rejects a request with no signature", async ({ request }) => {
    const res = await request.post(WEBHOOK, {
      data: { event: "charge.success", data: { reference: "TIPU-FAKE" } },
    });
    // Unconfigured => 503; configured => 401. Either way it must not be accepted.
    expect([401, 503]).toContain(res.status());
    expect(res.status()).not.toBe(200);
  });

  test("rejects a forged signature", async ({ request }) => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "TIPU-FAKE" } });
    const res = await request.post(WEBHOOK, {
      headers: {
        "content-type": "application/json",
        "x-paystack-signature": signed(body, "not-the-real-secret"),
      },
      data: body,
    });
    expect([401, 503]).toContain(res.status());
    expect(res.status()).not.toBe(200);
  });

  test("rejects a signature of the right shape but wrong content", async ({ request }) => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "TIPU-FAKE" } });
    const res = await request.post(WEBHOOK, {
      headers: {
        "content-type": "application/json",
        // 128 hex chars — correct length for SHA-512, so this exercises the
        // comparison rather than the length short-circuit.
        "x-paystack-signature": "a".repeat(128),
      },
      data: body,
    });
    expect([401, 503]).toContain(res.status());
  });

  test("does not acknowledge events while unconfigured", async ({ request }) => {
    // A blanket 200 would tell Paystack the event was handled when nothing was
    // verified or recorded.
    const res = await request.post(WEBHOOK, { data: { event: "charge.success" } });
    expect(res.status()).not.toBe(200);
  });

  test("refuses methods other than POST", async ({ request }) => {
    const res = await request.get(WEBHOOK);
    expect(res.status()).toBe(405);
  });

  test("leaks nothing about the secret in any response", async ({ request }) => {
    const res = await request.post(WEBHOOK, {
      headers: { "x-paystack-signature": "deadbeef" },
      data: { event: "charge.success", data: { reference: "x" } },
    });
    const text = await res.text();
    expect(text).not.toMatch(/sk_|secret|PAYSTACK_SECRET/i);
  });
});

test.describe("Payment callback and result pages", () => {
  test("a callback with no reference goes to the failed page, not success", async ({ page }) => {
    await page.goto("/support/payment/callback");
    await expect(page).toHaveURL(/\/support\/payment\/failed/);
    await expect(page.getByRole("heading", { name: /was not completed/i })).toBeVisible();
  });

  test("an unknown reference is never treated as paid", async ({ page }) => {
    await page.goto("/support/payment/callback?reference=TIPU-NOT-A-REAL-REFERENCE");
    // Query strings are not proof of payment: this must not reach success.
    await expect(page).not.toHaveURL(/\/support\/payment\/success/);
    await expect(page).toHaveURL(/\/support\/payment\/failed/);
  });

  test("the pending page does not tell people to pay again", async ({ page }) => {
    await page.goto("/support/payment/pending?reference=TIPU-TEST");
    await expect(page.getByRole("heading", { name: /still being completed/i })).toBeVisible();
    await expect(page.getByText(/please do not pay again/i)).toBeVisible();
  });

  test("result pages are not indexable and expose no payment internals", async ({ page }) => {
    for (const path of [
      "/support/payment/success?reference=TIPU-TEST",
      "/support/payment/pending?reference=TIPU-TEST",
      "/support/payment/failed?reference=TIPU-TEST",
    ]) {
      await page.goto(path);
      const robots = await page.locator('head meta[name="robots"]').getAttribute("content");
      expect(robots).toMatch(/noindex/);
      const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
      expect(text).not.toMatch(/authorization_code|\bcvv\b|\bpin\b|card number/i);
      expect(text).not.toMatch(/sk_|pk_live/i);
    }
  });

  test("the success page acknowledges rather than issuing a tax receipt", async ({ page }) => {
    await page.goto("/support/payment/success?reference=TIPU-TEST");
    await expect(page.getByText(/not a tax receipt/i)).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/tax deductible|charitable deduction/i);
  });
});

test.describe("Financial access control", () => {
  test("the contributions ledger is not reachable without signing in", async ({ page }) => {
    await page.goto("/admin/contributions");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("contribution records are absent from the sitemap and robots-allowed paths", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).not.toMatch(/\/support\/payment|\/admin\/contributions/);

    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toMatch(/Disallow: \/admin/);
  });
});

test.describe("Privacy disclosure", () => {
  test("states how direct bank transfers and contribution records are handled", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Community Contributions" })).toBeVisible();
    await expect(
      page.getByText(/Community contributions to the union are made by direct bank transfer/i),
    ).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/we store your card|card details are stored/i);
  });

  test("Get Involved directs to Support for direct bank transfer", async ({ page }) => {
    await page.goto("/get-involved");
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(text).toMatch(/Contributions to the union can be made by direct bank transfer/i);
    expect(text).not.toMatch(/donations are not yet enabled|online contribution payment is currently in testing/i);
  });
});
