"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const categoryOptions = [
  "photograph", "programme", "church_record", "school_record", "document", "constitution",
  "meeting_minutes", "oral_history", "map", "newspaper_report", "video", "audio", "biography", "publication",
].map((c) => ({ value: c, label: c.replace(/_/g, " ") }));

const accessOptions = [
  { value: "public", label: "Public" },
  { value: "community", label: "Community" },
  { value: "admin_only", label: "Admin Only" },
];

const verificationOptions = [
  { value: "unverified", label: "Unverified" },
  { value: "oral_history", label: "Oral History" },
  { value: "community_tradition", label: "Community Tradition" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "verified", label: "Verified" },
  { value: "disputed", label: "Disputed" },
];

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

export function ArchiveItemForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};
  const tags = Array.isArray(dv.tags) ? (dv.tags as string[]).join(", ") : "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Title" name="title" required defaultValue={dv.title as string} error={state.fieldErrors?.title} />
        <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} />
      </div>
      <TextAreaField label="Description" name="description" rows={4} defaultValue={dv.description as string} />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Item Date" name="item_date" type="date" defaultValue={dv.item_date as string} />
        <SelectField label="Category" name="category" required options={categoryOptions} defaultValue={dv.category as string} />
        <TextField label="Tags" name="tags" hint="Comma-separated" defaultValue={tags} />
      </div>
      <CheckboxField name="is_approximate_date" defaultChecked={Boolean(dv.is_approximate_date)} label="This date is approximate (will show as “c. …”)" />

      <FileUploadField name="file_url" label="Original File" bucket="archive" defaultUrl={dv.file_url as string} />
      <FileUploadField name="thumbnail_url" label="Thumbnail" bucket="archive" accept="image/*" defaultUrl={dv.thumbnail_url as string} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Contributor" name="contributor" defaultValue={dv.contributor as string} />
        <TextField label="Rights / Usage Notes" name="rights_notes" defaultValue={dv.rights_notes as string} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField label="Access Level" name="access_level" required options={accessOptions} defaultValue={dv.access_level as string} />
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <SelectField label="Publication Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <SubmitButton>Save Archive Item</SubmitButton>
    </form>
  );
}
