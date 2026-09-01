"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TextField, TextAreaField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { OrikiRecord } from "@/lib/data/oriki-records";

const initialState: AdminFormState = { status: "idle" };

interface Props {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  record?: OrikiRecord | null;
}

export function OrikiRecordForm({ action, record }: Props) {
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
              href="/oriki"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-900"
            >
              View public page →
            </a>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Family / Origin"
          name="family_origin"
          required
          defaultValue={record?.family_origin ?? ""}
          error={state.fieldErrors?.family_origin}
          hint="e.g. “Eseha”, “Attemogbe”"
        />

        <TextField
          label="Male Oríkì"
          name="male_oriki"
          required
          defaultValue={record?.male_oriki ?? ""}
          error={state.fieldErrors?.male_oriki}
          hint="Traditional male praise name"
        />

        <TextField
          label="Female Oríkì"
          name="female_oriki"
          required
          defaultValue={record?.female_oriki ?? ""}
          error={state.fieldErrors?.female_oriki}
          hint="Traditional female praise name"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Display Order"
          name="display_order"
          type="number"
          defaultValue={record?.display_order ? String(record.display_order) : "0"}
          error={state.fieldErrors?.display_order}
          hint="Position in public table (1, 2, 3...)"
        />

        <div className="flex items-center pt-6">
          <CheckboxField
            label="Publish record publicly"
            name="published"
            defaultChecked={record ? record.published : true}
          />
        </div>
      </div>

      <TextAreaField
        label="Cultural Notes / Details (Optional)"
        name="notes"
        rows={3}
        defaultValue={record?.notes ?? ""}
        hint="Optional contextual notes about lineage, compound association, or pronunciations."
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100">
        <Link
          href="/admin/oriki"
          className="rounded-xl px-4 py-2 text-sm font-medium text-charcoal/70 hover:bg-purple-50"
        >
          Cancel
        </Link>
        <SubmitButton>
          {record ? "Update Record" : "Create Record"}
        </SubmitButton>
      </div>
    </form>
  );
}
