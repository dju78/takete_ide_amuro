"use client";

import { useActionState } from "react";
import { submitVolunteerForm, type FormState } from "@/lib/actions/submissions";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";

const initialState: FormState = { status: "idle" };

const interestAreas = [
  { value: "volunteer_skills", label: "Volunteer Skills" },
  { value: "community_projects", label: "Community Projects" },
  { value: "diaspora_participation", label: "Diaspora Participation" },
  { value: "share_historical_materials", label: "Share Historical Materials" },
  { value: "oral_history_contribution", label: "Oral History Contribution" },
  { value: "community_partnerships", label: "Community Partnerships" },
  { value: "youth_engagement", label: "Youth Engagement" },
];

export function VolunteerForm() {
  const [state, formAction] = useActionState(submitVolunteerForm, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormStatusMessage state={state} />
      {state.status !== "success" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full Name" name="full_name" required error={state.fieldErrors?.full_name} />
            <TextField label="Email Address" name="email" type="email" required error={state.fieldErrors?.email} />
            <TextField label="Phone" name="phone" hint="Optional" error={state.fieldErrors?.phone} />
            <TextField label="Country" name="country" error={state.fieldErrors?.country} />
          </div>
          <SelectField label="I'm interested in" name="interest_area" required options={interestAreas} error={state.fieldErrors?.interest_area} />
          <TextAreaField label="Tell us more" name="message" hint="Optional — skills, availability, ideas" error={state.fieldErrors?.message} />
          <SubmitButton>Submit Interest</SubmitButton>
        </>
      )}
    </form>
  );
}
