"use server";

import { z } from "zod";
import { env, isPaystackConfigured } from "@/lib/env";
import { generateReference, initializeTransaction } from "@/lib/payments/paystack";
import { createPendingContribution } from "@/lib/payments/contributions";
import { resolveCallbackUrl } from "@/lib/payments/callback-url";
import { CONTRIBUTION_PURPOSES, toMinor } from "@/lib/payments/constants";

export interface ContributionFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Set on success — the browser is sent here to pay on Paystack's own domain. */
  authorizationUrl?: string;
  reference?: string;
}

/**
 * Server-side validation of everything the browser sent.
 *
 * The amount in particular is re-derived here and converted to the minor unit on
 * the server. A frontend-calculated amount is never trusted: the value stored on
 * the pending row is what verification later compares Paystack's figure against,
 * so it has to be computed somewhere the contributor cannot reach.
 */
function schema() {
  const min = env.contributionMinMajor;
  const max = env.contributionMaxMajor;

  return z.object({
    amount: z.coerce
      .number({ message: "Enter an amount." })
      .positive("Enter an amount greater than zero.")
      .min(min, `The minimum contribution is ₦${min.toLocaleString()}.`)
      .max(max, `For amounts above ₦${max.toLocaleString()}, please use a direct bank transfer.`),
    email: z.string().trim().email("Enter a valid email address so we can send your confirmation."),
    contributor_name: z.string().trim().max(120).optional(),
    purpose: z.enum(CONTRIBUTION_PURPOSES, { message: "Choose what your contribution is for." }),
    message: z.string().trim().max(500, "Please keep your message under 500 characters.").optional(),
  });
}

export async function startContributionAction(
  _prev: ContributionFormState,
  formData: FormData,
): Promise<ContributionFormState> {
  if (!isPaystackConfigured) {
    return {
      status: "error",
      message:
        "Online payment is not available at the moment. You can still contribute by direct bank transfer using the details on this page.",
    };
  }

  const parsed = schema().safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the details below.", fieldErrors };
  }

  // Resolved before anything is written. If there is no trustworthy origin to
  // return the contributor to, the payment must not start at all — taking money
  // and then failing to bring someone back is worse than not taking it.
  const callback = resolveCallbackUrl();
  if (!callback.ok) {
    console.error(`[contributions] refusing to initialize: ${callback.reason}`);
    return {
      status: "error",
      message:
        "Online payment is unavailable on this deployment. Please contribute by direct bank transfer using the details on this page.",
    };
  }

  const d = parsed.data;
  // NGN only for now. Additional currencies require the merchant account to have
  // them enabled, which cannot be assumed from here.
  const currency = "NGN";
  const amountMinor = toMinor(d.amount);
  const reference = generateReference();

  // The pending record is written *before* the contributor leaves the site. If
  // this fails we stop: a payment we cannot reconcile is worse than one that
  // never started.
  const pending = await createPendingContribution({
    reference,
    email: d.email,
    contributorName: d.contributor_name?.trim() || null,
    message: d.message?.trim() || null,
    amountMinor,
    currency,
    purpose: d.purpose,
  });

  if (!pending.ok) {
    return {
      status: "error",
      message:
        "We could not start your contribution just now. Please try again, or use the direct bank transfer details on this page.",
    };
  }

  const init = await initializeTransaction({
    email: d.email,
    amountMinor,
    currency,
    reference,
    callbackUrl: callback.url,
    // Operational context only — nothing here is sensitive, and it makes a
    // transaction identifiable in Paystack's dashboard during reconciliation.
    metadata: {
      purpose: d.purpose,
      reference,
      site: "takete-ide",
      custom_fields: [
        { display_name: "Purpose", variable_name: "purpose", value: d.purpose },
      ],
    },
  });

  if (!init.ok) {
    return {
      status: "error",
      message: `${init.error} You can also contribute by direct bank transfer using the details on this page.`,
    };
  }

  return { status: "idle", authorizationUrl: init.data.authorizationUrl, reference };
}
