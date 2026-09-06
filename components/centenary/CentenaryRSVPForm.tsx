"use client";

import { useActionState } from "react";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { submitCentenaryRSVP, type RSVPFormState } from "@/lib/actions/centenary-rsvp";

const initialState: RSVPFormState = {};

export function CentenaryRSVPForm() {
  const [state, formAction, isPending] = useActionState(submitCentenaryRSVP, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-community-green/30 bg-green-50/60 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-community-green/20 text-community-green">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h4 className="mt-4 font-serif text-xl font-bold text-purple-950">RSVP Confirmed</h4>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
          {state.message}
        </p>
        <p className="mt-4 text-xs text-charcoal/60">
          We look forward to welcoming you to the historic Takete-Ide Centenary Celebration (29–31 October 2026).
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.message && !state.success && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" aria-hidden="true" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-purple-950">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            required
            placeholder="e.g. Chief / Dr / Mr / Mrs First Last"
            className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
          />
          {state.errors?.fullName && (
            <p className="mt-1 text-xs text-red-600">{state.errors.fullName[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-purple-950">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              className="block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
            />
          </div>
          {state.errors?.email && (
            <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-purple-950">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="+234 800 000 0000"
            className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
          />
          {state.errors?.phone && (
            <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="partySize" className="block text-xs font-semibold text-purple-950">
            Estimated Party Size <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="partySize"
            name="partySize"
            min={1}
            max={50}
            defaultValue={1}
            required
            className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
          />
          {state.errors?.partySize && (
            <p className="mt-1 text-xs text-red-600">{state.errors.partySize[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="branchOrChapter" className="block text-xs font-semibold text-purple-950">
            TIPU Branch / Chapter <span className="text-xs font-normal text-charcoal/50">(Optional)</span>
          </label>
          <input
            type="text"
            id="branchOrChapter"
            name="branchOrChapter"
            placeholder="e.g. Home Branch, Lokoja, Ilorin, UK & Europe"
            className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-xs font-semibold text-purple-950">
            Country of Residence <span className="text-xs font-normal text-charcoal/50">(Optional)</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="e.g. Nigeria, United Kingdom, USA"
            className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="accessibilityRequirements" className="block text-xs font-semibold text-purple-950">
          Special Arrangements or Accessibility Needs <span className="text-xs font-normal text-charcoal/50">(Optional)</span>
        </label>
        <textarea
          id="accessibilityRequirements"
          name="accessibilityRequirements"
          rows={2}
          placeholder="Let the organizing committee know if you or members of your party require seating assistance, elderly support, or specific arrangements."
          className="mt-1 block w-full rounded-xl border border-purple-600/20 bg-white px-3.5 py-2 text-sm text-charcoal shadow-xs transition focus:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20"
        />
      </div>

      <div className="pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked
            className="mt-0.5 h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-xs leading-relaxed text-charcoal/80">
            I confirm my attendance and agree to allow the organizing committee to use these details for event planning and attendance coordination. Contact information will remain confidential.
          </span>
        </label>
        {state.errors?.consent && (
          <p className="mt-1 text-xs text-red-600">{state.errors.consent[0]}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-purple-800 disabled:opacity-50 sm:w-auto"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isPending ? "Submitting RSVP..." : "Submit Web RSVP"}
        </button>
      </div>
    </form>
  );
}
