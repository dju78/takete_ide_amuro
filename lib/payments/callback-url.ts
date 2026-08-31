/**
 * Where Paystack should return a contributor after checkout.
 *
 * This value is sent to Paystack at initialization and is therefore the address
 * someone lands on immediately after paying. Three properties matter, in this
 * order:
 *
 *  1. It must never come from the request. A `Host` header is attacker-supplied,
 *     so deriving the callback from it would let anyone have Paystack return
 *     *our* payers to a host they control. Everything here reads deployment
 *     configuration only — there is no request parameter, by design.
 *
 *  2. It must be reachable. The previous implementation defaulted to a domain
 *     the union has not registered, so a missing `NEXT_PUBLIC_SITE_URL` would
 *     have taken payment and then returned the payer to a host that does not
 *     resolve. There is no fallback origin now: an unusable configuration
 *     disables checkout rather than stranding someone mid-payment.
 *
 *  3. It must match the deployment. A Netlify deploy preview has its own origin,
 *     and a test transaction started there should come back there rather than
 *     landing on production.
 *
 * Deliberately free of `server-only` and of any secret: this reads deployment
 * metadata, nothing more, which also keeps it directly testable.
 */

export interface CallbackEnvironment {
  /** Netlify `CONTEXT`: production | deploy-preview | branch-deploy | dev. */
  context?: string;
  /** Netlify `DEPLOY_PRIME_URL` — the origin of this particular deploy. */
  deployPrimeUrl?: string;
  /** `NEXT_PUBLIC_SITE_URL` — the union's configured production origin. */
  siteUrl?: string;
  nodeEnv?: string;
}

export type CallbackOriginResult =
  | { ok: true; origin: string; source: "deploy" | "configured" | "development" }
  | { ok: false; reason: string };

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function isLocal(hostname: string) {
  return LOCAL_HOSTS.has(hostname);
}

/**
 * Validates one candidate origin.
 *
 * HTTPS is required everywhere except a local host, because the callback URL is
 * handed to a payment provider and travels back through the contributor's
 * browser. Plain HTTP is tolerated only for `localhost`, and only when this is
 * not a production build.
 */
function validate(candidate: string, isProduction: boolean): CallbackOriginResult {
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, reason: `not a valid absolute URL: ${candidate}` };
  }

  if (url.protocol === "https:") {
    return { ok: true, origin: url.origin, source: "configured" };
  }

  if (url.protocol === "http:" && isLocal(url.hostname) && !isProduction) {
    return { ok: true, origin: url.origin, source: "development" };
  }

  if (url.protocol === "http:") {
    return {
      ok: false,
      reason: isLocal(url.hostname)
        ? "http://localhost is not an acceptable callback origin in a production build"
        : `insecure callback origin (${url.origin}); HTTPS is required outside local development`,
    };
  }

  return { ok: false, reason: `unsupported protocol for a callback origin: ${url.protocol}` };
}

export function resolveCallbackOrigin(source?: CallbackEnvironment): CallbackOriginResult {
  const environment: CallbackEnvironment = source ?? {
    context: process.env.CONTEXT,
    deployPrimeUrl: process.env.DEPLOY_PRIME_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    nodeEnv: process.env.NODE_ENV,
  };

  const isProduction = environment.nodeEnv === "production";

  // A preview or branch deploy has its own origin. Netlify sets both of these
  // itself, so they are trusted deployment metadata rather than request input.
  const isPreviewDeploy =
    environment.context === "deploy-preview" || environment.context === "branch-deploy";

  if (isPreviewDeploy) {
    const prime = environment.deployPrimeUrl?.trim();
    if (!prime) {
      return {
        ok: false,
        reason: `deploy context is "${environment.context}" but DEPLOY_PRIME_URL is not set`,
      };
    }
    const result = validate(prime, isProduction);
    return result.ok ? { ...result, source: "deploy" } : result;
  }

  const configured = environment.siteUrl?.trim();
  if (configured) return validate(configured, isProduction);

  // Nothing configured. Outside a production build, assume the default dev
  // server so local work is not blocked; in production, fail closed.
  if (!isProduction) {
    return { ok: true, origin: "http://localhost:3000", source: "development" };
  }

  return {
    ok: false,
    reason: "NEXT_PUBLIC_SITE_URL is not set, so there is no origin to return contributors to",
  };
}

/** The full URL Paystack is given, or a reason it cannot be built. */
export function resolveCallbackUrl(
  source?: CallbackEnvironment,
): { ok: true; url: string } | { ok: false; reason: string } {
  const origin = resolveCallbackOrigin(source);
  if (!origin.ok) return origin;
  return { ok: true, url: `${origin.origin}/support/payment/callback` };
}
