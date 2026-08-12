"use client";

import { useActionState } from "react";
import { TextField, TextAreaField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { addProjectUpdateAction } from "@/lib/actions/admin-projects";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function AddProjectUpdateForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(addProjectUpdateAction.bind(null, projectId), initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-purple-600/10 bg-purple-50/40 p-4" noValidate>
      {state.message && <p className="rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <TextField label="Update Title" name="title" required error={state.fieldErrors?.title} />
        <TextField label="Date" name="update_date" type="date" required error={state.fieldErrors?.update_date} />
      </div>
      <TextAreaField label="Details" name="body" rows={2} />
      <SubmitButton>Add Update</SubmitButton>
    </form>
  );
}
