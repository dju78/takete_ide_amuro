"use client";

import { useActionState } from "react";
import { ShieldAlert } from "lucide-react";
import { TextField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { saveSupportAccountAction } from "@/lib/actions/admin-community-programme";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export interface AccountRow {
  id: string;
  account_name: string;
  bank_name: string;
  account_number: string;
  purpose: string | null;
  is_active: boolean;
}

export function SupportAccountForm({ account }: { account?: AccountRow }) {
  const action = saveSupportAccountAction.bind(null, account?.id ?? null);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && (
        <div
          className={`flex items-center justify-between gap-3 rounded-xl p-3 text-sm ${
            state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"
          }`}
        >
          <span>{state.message}</span>
          {state.status !== "error" && (
            <a
              href="/support"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-900"
            >
              View public Support page →
            </a>
          )}
        </div>
      )}

      <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Check every digit before saving.</p>
          <p className="mt-1">
            This account number is published on the public Support page and on the homepage. Confirm it
            against an official union document — not a screenshot or a forwarded message. Every change is
            recorded in the audit log with the previous value.
          </p>
        </div>
      </div>

      <TextField
        label="Account name"
        name="account_name"
        required
        hint="Must match the beneficiary name the bank displays"
        defaultValue={account?.account_name ?? "Takete Ide Progressive Union"}
        error={state.fieldErrors?.account_name}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Bank"
          name="bank_name"
          required
          defaultValue={account?.bank_name ?? "First Bank"}
          error={state.fieldErrors?.bank_name}
        />
        <TextField
          label="Account number"
          name="account_number"
          required
          hint="10 digits"
          defaultValue={account?.account_number ?? ""}
          error={state.fieldErrors?.account_number}
        />
      </div>
      <TextField
        label="Purpose"
        name="purpose"
        hint="Optional — what this account is for"
        defaultValue={account?.purpose ?? ""}
      />

      <CheckboxField
        name="is_active"
        defaultChecked={account?.is_active ?? false}
        label={
          <>
            <span className="font-medium text-charcoal">Publish this account</span> — shows it on the
            public Support page. Only one account can be active; activating this one deactivates any
            other.
          </>
        }
      />

      <SubmitButton>Save account</SubmitButton>
    </form>
  );
}
