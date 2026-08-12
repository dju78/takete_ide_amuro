"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const verificationOptions = [
  { value: "unverified", label: "Unverified" },
  { value: "oral_history", label: "Oral History" },
  { value: "community_tradition", label: "Community Tradition" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "verified", label: "Verified" },
  { value: "disputed", label: "Disputed" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaultValues?: Record<string, unknown>;
}

const initialState: AdminFormState = { status: "idle" };

export function RulerForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full Name" name="full_name" required defaultValue={dv.full_name as string} error={state.fieldErrors?.full_name} />
        <TextField label="Regnal Title" name="regnal_title" required defaultValue={(dv.regnal_title as string) ?? "Olude of Takete-Ide Amuro"} error={state.fieldErrors?.regnal_title} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Reign Start" name="reign_start" type="date" defaultValue={dv.reign_start as string} />
        <TextField label="Reign End" name="reign_end" type="date" hint="Leave blank if reigning" defaultValue={dv.reign_end as string} />
      </div>
      <CheckboxField name="is_current" defaultChecked={Boolean(dv.is_current)} label="This is the current, reigning Olude" />

      <FileUploadField name="photo_url" label="Photograph" bucket="people" accept="image/*" defaultUrl={dv.photo_url as string} />
      <TextAreaField label="Biography" name="biography" rows={5} defaultValue={dv.biography as string} />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <TextField label="Sort Order" name="sort_order" type="number" defaultValue={String(dv.sort_order ?? 0)} />
      </div>

      <SubmitButton>Save Ruler</SubmitButton>
    </form>
  );
}
