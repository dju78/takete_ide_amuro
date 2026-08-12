"use client";

import { useActionState } from "react";
import { submitNomination, type FormState } from "@/lib/actions/submissions";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";

const initialState: FormState = { status: "idle" };

const categories = [
  { value: "traditional_leaders", label: "Traditional Leaders" },
  { value: "community_leaders", label: "Community Leaders" },
  { value: "public_service", label: "Public Service" },
  { value: "academia", label: "Academia" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "business", label: "Business" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "arts_culture", label: "Arts & Culture" },
  { value: "sports", label: "Sports" },
  { value: "diaspora", label: "Diaspora" },
  { value: "young_achievers", label: "Young Achievers" },
];

export function NominationForm() {
  const [state, formAction] = useActionState(submitNomination, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormStatusMessage state={state} />
      {state.status !== "success" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nominee's Name" name="nominee_name" required error={state.fieldErrors?.nominee_name} />
            <SelectField label="Category" name="category" required options={categories} error={state.fieldErrors?.category} />
          </div>
          <TextAreaField label="Biography" name="biography" required error={state.fieldErrors?.biography} />
          <TextAreaField label="Achievements" name="achievements" hint="Optional" error={state.fieldErrors?.achievements} />
          <TextField label="Evidence / Source" name="evidence_source" hint="Optional — link or reference" error={state.fieldErrors?.evidence_source} />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Your Name" name="submitter_name" required error={state.fieldErrors?.submitter_name} />
            <TextField label="Your Email" name="submitter_email" type="email" required error={state.fieldErrors?.submitter_email} />
          </div>
          <CheckboxField
            name="permission"
            error={state.fieldErrors?.permission}
            label="I confirm this nominee (or their family) is aware of and agrees to this nomination."
          />
          <SubmitButton>Submit Nomination</SubmitButton>
        </>
      )}
    </form>
  );
}
