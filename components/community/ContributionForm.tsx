"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { startContributionAction, type ContributionFormState } from "@/lib/actions/contributions";
import { CONTRIBUTION_PURPOSES } from "@/lib/payments/constants";

const initialState: ContributionFormState = { status: "idle" };

/** Quick-pick amounts in naira. The field stays editable — these are shortcuts. */
const PRESETS = [2_000, 5_000, 10_000, 25_000, 50_000];

export function ContributionForm({
  minAmount,
  maxAmount,
}: {
  minAmount: number;
  maxAmount: number;
}) {
  const [state, formAction] = useActionState(startContributionAction, initialState);
  const [amount, setAmount] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const ids = {
    amount: useId(),
    email: useId(),
    name: useId(),
    purpose: useId(),
    message: useId(),
  };

  /**
   * Paystack's hosted checkout lives on Paystack's domain — that is what keeps
   * card, PIN and OTP entry off this site entirely. On success the action
   * returns an authorization URL and the browser goes there.
   */
  // Derived, not stored: the action result already tells us we are leaving, so
  // the effect only performs the navigation itself.
  const redirecting = Boolean(state.authorizationUrl);

  useEffect(() => {
    if (state.authorizationUrl) window.location.href = state.authorizationUrl;
  }, [state.authorizationUrl]);

  // Move focus to the error summary so a keyboard or screen-reader user is told
  // what went wrong rather than being left at the submit button.
  useEffect(() => {
    if (state.status === "error" && errorRef.current) errorRef.current.focus();
  }, [state]);

  const err = (field: string) => state.fieldErrors?.[field];
  const describedBy = (field: string, hintId?: string) =>
    [err(field) ? `${field}-error` : null, hintId].filter(Boolean).join(" ") || undefined;

  const inputClass = (invalid: boolean) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-base text-charcoal outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${
      invalid ? "border-red-500" : "border-purple-600/20"
    }`;

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.message && (
        <p
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl bg-red-100 p-3 text-sm text-red-800 outline-none"
        >
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor={ids.amount} className="block text-sm font-medium text-charcoal">
          Contribution amount <span className="text-red-600">*</span>
        </label>
        <p id="amount-hint" className="mt-0.5 text-xs text-charcoal/55">
          In Nigerian naira. Minimum ₦{minAmount.toLocaleString()}.
        </p>
        <div className="relative mt-1.5">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-charcoal/50"
          >
            ₦
          </span>
          <input
            id={ids.amount}
            name="amount"
            // `inputMode="decimal"` gives a numeric keypad on phones without
            // the spinner and scroll-to-change behaviour of type="number".
            type="text"
            inputMode="decimal"
            autoComplete="off"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
            aria-invalid={Boolean(err("amount"))}
            aria-describedby={describedBy("amount", "amount-hint")}
            className={`${inputClass(Boolean(err("amount")))} pl-9`}
            placeholder="5000"
          />
        </div>
        {err("amount") && (
          <p id="amount-error" className="mt-1 text-xs text-red-600">
            {err("amount")}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.filter((p) => p >= minAmount && p <= maxAmount).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              aria-pressed={amount === String(p)}
              className={`inline-flex min-h-9 items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                amount === String(p)
                  ? "bg-purple-600 text-white"
                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
              }`}
            >
              ₦{p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={ids.purpose} className="block text-sm font-medium text-charcoal">
          What is your contribution for? <span className="text-red-600">*</span>
        </label>
        <select
          id={ids.purpose}
          name="purpose"
          required
          defaultValue={CONTRIBUTION_PURPOSES[0]}
          aria-invalid={Boolean(err("purpose"))}
          aria-describedby={describedBy("purpose")}
          className={`mt-1.5 ${inputClass(Boolean(err("purpose")))}`}
        >
          {CONTRIBUTION_PURPOSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {err("purpose") && (
          <p id="purpose-error" className="mt-1 text-xs text-red-600">
            {err("purpose")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.email} className="block text-sm font-medium text-charcoal">
            Email address <span className="text-red-600">*</span>
          </label>
          <p id="email-hint" className="mt-0.5 text-xs text-charcoal/55">
            For your payment confirmation.
          </p>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(err("email"))}
            aria-describedby={describedBy("email", "email-hint")}
            className={`mt-1.5 ${inputClass(Boolean(err("email")))}`}
          />
          {err("email") && (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {err("email")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={ids.name} className="block text-sm font-medium text-charcoal">
            Your name
          </label>
          <p id="name-hint" className="mt-0.5 text-xs text-charcoal/55">
            Optional — leave blank to contribute anonymously.
          </p>
          <input
            id={ids.name}
            name="contributor_name"
            type="text"
            autoComplete="name"
            aria-describedby="name-hint"
            className={`mt-1.5 ${inputClass(false)}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor={ids.message} className="block text-sm font-medium text-charcoal">
          Message
        </label>
        <p id="message-hint" className="mt-0.5 text-xs text-charcoal/55">
          Optional — a short note to the union.
        </p>
        <textarea
          id={ids.message}
          name="message"
          rows={2}
          maxLength={500}
          aria-describedby={describedBy("message", "message-hint")}
          className={`mt-1.5 ${inputClass(Boolean(err("message")))}`}
        />
        {err("message") && (
          <p id="message-error" className="mt-1 text-xs text-red-600">
            {err("message")}
          </p>
        )}
      </div>

      {redirecting ? (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-purple-600">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Taking you to the secure payment page…
        </p>
      ) : (
        <SubmitButton>Continue to secure payment</SubmitButton>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/60">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Payment is completed on Paystack&rsquo;s secure page, where you can pay using the methods
          enabled for Takete-Ide — such as card, bank, transfer or USSD. Takete-Ide never sees or stores
          your card number, PIN or OTP.
        </span>
      </p>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/60">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Your contribution is confirmed only after our server verifies it with Paystack.</span>
      </p>
    </form>
  );
}
