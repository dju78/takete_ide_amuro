"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import {
  createTipuLeaderAction,
  createTipuAnnouncementAction,
  createTipuDocumentAction,
} from "@/lib/actions/admin-tipu";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function AddTipuLeaderForm() {
  const [state, formAction] = useActionState(createTipuLeaderAction, initialState);
  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-purple-600/10 bg-white p-4 sm:grid-cols-2" noValidate>
      {state.message && <p className="sm:col-span-2 rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <TextField label="Full Name" name="full_name" required error={state.fieldErrors?.full_name} />
      <TextField label="Position" name="position" required error={state.fieldErrors?.position} />
      <TextField label="Branch" name="branch" hint="Optional" />
      <FileUploadField name="photo_url" label="Photo" bucket="tipu" accept="image/*" />
      <div className="sm:col-span-2"><SubmitButton>Add Leader</SubmitButton></div>
    </form>
  );
}

export function AddTipuAnnouncementForm() {
  const [state, formAction] = useActionState(createTipuAnnouncementAction, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-purple-600/10 bg-white p-4" noValidate>
      {state.message && <p className="rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <TextField label="Title" name="title" required error={state.fieldErrors?.title} />
      <TextAreaField label="Message" name="body" rows={3} />
      <SelectField
        label="Status"
        name="status"
        required
        options={[
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ]}
        defaultValue="draft"
      />
      <SubmitButton>Add Announcement</SubmitButton>
    </form>
  );
}

export function AddTipuDocumentForm() {
  const [state, formAction] = useActionState(createTipuDocumentAction, initialState);
  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-purple-600/10 bg-white p-4" noValidate>
      {state.message && <p className="rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <TextField label="Title" name="title" required error={state.fieldErrors?.title} />
      <TextField label="Document Type" name="document_type" hint="e.g. Constitution, Report" />
      <FileUploadField name="document_url" label="File" bucket="tipu" required />
      <SubmitButton>Add Document</SubmitButton>
    </form>
  );
}
