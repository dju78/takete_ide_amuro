"use client";

import { useActionState } from "react";
import { submitDiasporaForm, type FormState } from "@/lib/actions/submissions";
import { TextField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";

const initialState: FormState = { status: "idle" };

const interests = [
  "Volunteering skills",
  "Mentoring young people",
  "Development project funding",
  "Professional/technical expertise",
  "Event participation",
];

export function DiasporaForm() {
  const [state, formAction] = useActionState(submitDiasporaForm, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormStatusMessage state={state} />
      {state.status !== "success" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full Name" name="full_name" required error={state.fieldErrors?.full_name} />
            <TextField label="Email Address" name="email" type="email" required error={state.fieldErrors?.email} />
            <TextField label="Country" name="country" required error={state.fieldErrors?.country} />
            <TextField label="City" name="city" error={state.fieldErrors?.city} />
            <TextField label="Profession" name="profession" error={state.fieldErrors?.profession} />
            <TextField label="Area of Expertise" name="area_of_expertise" error={state.fieldErrors?.area_of_expertise} />
          </div>
          <TextField
            label="Takete-Ide Family / Compound"
            name="family_compound"
            hint="Optional"
            error={state.fieldErrors?.family_compound}
          />
          <fieldset>
            <legend className="text-sm font-medium text-charcoal">How would you like to contribute?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {interests.map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm text-charcoal/80">
                  <input type="checkbox" name="contribution_interests" value={interest} className="h-4 w-4 rounded border-purple-600/30 text-purple-600" />
                  {interest}
                </label>
              ))}
            </div>
          </fieldset>
          <CheckboxField
            name="consent"
            error={state.fieldErrors?.consent}
            label="I consent to Takete-Ide Amuro storing this information to contact me about community activities. My details will not be published publicly."
          />
          <SubmitButton>Join the Network</SubmitButton>
        </>
      )}
    </form>
  );
}
