"use client";

import { useActionState } from "react";
import { submitHeritageMaterial, type FormState } from "@/lib/actions/submissions";
import { TextField, TextAreaField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";

const initialState: FormState = { status: "idle" };

export function HeritageSubmissionForm({
  submissionType,
  detailsLabel,
}: {
  submissionType: "family_history" | "oriki" | "historical_material" | "oral_history" | "photo_identification";
  detailsLabel: string;
}) {
  const [state, formAction] = useActionState(submitHeritageMaterial, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="submission_type" value={submissionType} />
      <FormStatusMessage state={state} />
      {state.status !== "success" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Family Name" name="family_name" error={state.fieldErrors?.family_name} />
            <TextField label="Compound" name="compound" error={state.fieldErrors?.compound} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Your Name" name="submitter_name" required error={state.fieldErrors?.submitter_name} />
            <TextField label="Relationship to Family" name="submitter_relationship" error={state.fieldErrors?.submitter_relationship} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Email" name="submitter_email" type="email" required error={state.fieldErrors?.submitter_email} />
            <TextField label="Phone" name="submitter_phone" hint="Optional" error={state.fieldErrors?.submitter_phone} />
          </div>
          <TextAreaField label={detailsLabel} name="details" required rows={7} error={state.fieldErrors?.details} />
          <TextField
            label="Source Information"
            name="source_information"
            hint="Who told you this, or where does it come from? (elder's name, document, etc.)"
            error={state.fieldErrors?.source_information}
          />
          <CheckboxField
            name="permission_to_archive"
            error={state.fieldErrors?.permission_to_archive}
            label="I confirm I have the right to share this material and give permission for it to be archived by Takete-Ide Amuro."
          />
          <CheckboxField
            name="permission_to_publish"
            label="I also give permission for this material to be published publicly on the website once reviewed (optional — archive-only submissions are also welcome)."
          />
          <p className="text-xs text-charcoal/50">
            Photographs, audio, video and documents can be emailed or shared with the archive team after
            submitting this form — file upload from this form will be enabled once the admin media pipeline
            is connected.
          </p>
          <SubmitButton>Submit for Review</SubmitButton>
        </>
      )}
    </form>
  );
}
