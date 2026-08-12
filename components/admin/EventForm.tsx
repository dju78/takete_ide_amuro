"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "verified", label: "Verified" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaultValues?: Record<string, unknown>;
}

const initialState: AdminFormState = { status: "idle" };

export function EventForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Year" name="year" type="number" required defaultValue={dv.year != null ? String(dv.year) : ""} error={state.fieldErrors?.year} />
        <TextField label="Theme" name="theme" defaultValue={dv.theme as string} />
      </div>
      <TextField label="Event Date" name="event_date" type="date" defaultValue={dv.event_date as string} />
      <TextAreaField label="Description" name="description" rows={4} defaultValue={dv.description as string} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Chairman" name="chairman" defaultValue={dv.chairman as string} />
        <TextField label="Guest Information" name="guest_information" defaultValue={dv.guest_information as string} />
      </div>

      <FileUploadField name="programme_document_url" label="Programme (PDF)" bucket="events" accept="application/pdf" defaultUrl={dv.programme_document_url as string} />

      <SelectField label="Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />

      <SubmitButton>Save Event</SubmitButton>
    </form>
  );
}
