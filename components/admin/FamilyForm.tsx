"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { SelectOption } from "@/lib/data/admin";

const verificationOptions = [
  { value: "draft", label: "Draft" },
  { value: "family_submitted", label: "Family Submitted" },
  { value: "oral_history", label: "Oral History" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "community_reviewed", label: "Community Reviewed" },
  { value: "verified", label: "Verified" },
  { value: "disputed", label: "Disputed" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "verified", label: "Verified" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  compounds: SelectOption[];
  defaultValues?: Record<string, unknown>;
}

const initialState: AdminFormState = { status: "idle" };

export function FamilyForm({ action, compounds, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};
  const altNames = Array.isArray(dv.alternative_names) ? (dv.alternative_names as string[]).join(", ") : "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Family Name" name="name" required defaultValue={dv.name as string} error={state.fieldErrors?.name} />
        <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} />
      </div>
      <TextField label="Alternative Names / Spellings" name="alternative_names" hint="Comma-separated" defaultValue={altNames} />
      <SelectField
        label="Compound"
        name="compound_id"
        hint="Optional"
        defaultValue={(dv.compound_id as string) ?? ""}
        options={[{ value: "", label: "— None —" }, ...compounds.map((c) => ({ value: c.id, label: c.name }))]}
      />

      <TextAreaField label="Summary" name="summary" rows={3} defaultValue={dv.summary as string} />
      <TextAreaField label="Family History" name="history" rows={6} defaultValue={dv.history as string} />
      <TextAreaField
        label="Known Ancestral Accounts"
        name="known_ancestral_accounts"
        rows={4}
        hint="Where accounts differ, present them neutrally — do not resolve disputes here"
        defaultValue={dv.known_ancestral_accounts as string}
      />
      <TextAreaField label="Migration & Settlement History" name="migration_settlement_history" rows={4} defaultValue={dv.migration_settlement_history as string} />
      <TextAreaField label="Family Values & Traditions" name="values_and_traditions" rows={3} defaultValue={dv.values_and_traditions as string} />
      <TextAreaField label="Notable Contributions to Takete-Ide" name="notable_contributions" rows={3} defaultValue={dv.notable_contributions as string} />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <SelectField label="Publication Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <p className="text-xs text-charcoal/50">
        Family photographs, documents and audio/video are managed from this family&rsquo;s detail
        record via Supabase Studio (family_media table) for now — a dedicated media manager is a
        documented follow-up.
      </p>

      <SubmitButton>Save Family</SubmitButton>
    </form>
  );
}
