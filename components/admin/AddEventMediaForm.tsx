"use client";

import { useActionState } from "react";
import { SelectField, TextField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { addEventMediaAction } from "@/lib/actions/admin-events";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function AddEventMediaForm({ eventId }: { eventId: string }) {
  const [state, formAction] = useActionState(addEventMediaAction.bind(null, eventId), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-purple-600/10 bg-purple-50/40 p-4" noValidate>
      {state.message && <p className="rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <SelectField label="Type" name="media_type" required options={[{ value: "photo", label: "Photo" }, { value: "video", label: "Video" }]} defaultValue="photo" />
      <FileUploadField name="url" label="File" bucket="events" required />
      <TextField label="Caption" name="caption" hint="Optional" />
      <SubmitButton>Add to Event</SubmitButton>
    </form>
  );
}
