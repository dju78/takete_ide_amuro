"use client";

import { useActionState } from "react";
import { submitContactForm, type FormState } from "@/lib/actions/submissions";
import { TextField, TextAreaField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";

const initialState: FormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormStatusMessage state={state} />
      {state.status !== "success" && (
        <>
          <TextField label="Full Name" name="name" required error={state.fieldErrors?.name} />
          <TextField label="Email Address" name="email" type="email" required error={state.fieldErrors?.email} />
          <TextField label="Subject" name="subject" error={state.fieldErrors?.subject} />
          <TextAreaField label="Message" name="message" required error={state.fieldErrors?.message} />
          <CheckboxField
            name="consent"
            error={state.fieldErrors?.consent}
            label="I agree that Takete-Ide Amuro may contact me about this message, in line with the Privacy Policy."
          />
          <SubmitButton>Send Message</SubmitButton>
        </>
      )}
    </form>
  );
}
