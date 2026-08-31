"use client";

import { useActionState } from "react";
import { TextField, TextAreaField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateTrustFundAction } from "@/lib/actions/admin-community-programme";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { TrustFundReport } from "@/lib/media/community-programme";

const initialState: AdminFormState = { status: "idle" };

export function TrustFundForm({ fund }: { fund: TrustFundReport }) {
  const [state, formAction] = useActionState(updateTrustFundAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && (
        <p
          className={`rounded-xl p-3 text-sm ${
            state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Total branch levy"
          name="target_amount"
          type="number"
          required
          defaultValue={String(fund.targetAmount)}
          error={state.fieldErrors?.target_amount}
        />
        <TextField
          label="Amount reported paid"
          name="amount_paid"
          type="number"
          required
          hint="The outstanding balance and percentage are calculated from these two figures."
          defaultValue={String(fund.amountPaid)}
          error={state.fieldErrors?.amount_paid}
        />
        <TextField label="Currency" name="currency" required defaultValue={fund.currency} />
        <TextField
          label="Figures reported on"
          name="as_of"
          type="date"
          required
          hint="Required. The public page always shows this date beside the figures."
          defaultValue={fund.asOf}
          error={state.fieldErrors?.as_of}
        />
      </div>

      <TextAreaField
        label="Note"
        name="note"
        rows={2}
        hint="Shown under the figures. Never name individual contributors."
        defaultValue={fund.note}
      />

      <SubmitButton>Save fund figures</SubmitButton>
    </form>
  );
}
