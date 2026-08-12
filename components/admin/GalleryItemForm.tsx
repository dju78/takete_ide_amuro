"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { SelectOption } from "@/lib/data/admin";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const categoryOptions = [
  "Community Life", "Traditional Institution", "Takete-Ide Day", "Children & Cultural Heritage",
  "Development", "Historical Archive", "People", "Education", "Events",
].map((c) => ({ value: c, label: c }));

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  albums: SelectOption[];
  defaultValues?: Record<string, unknown>;
}

const initialState: AdminFormState = { status: "idle" };

export function GalleryItemForm({ action, albums, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <FileUploadField name="image_url" label="Photograph" bucket="gallery" accept="image/*" required defaultUrl={dv.image_url as string} />
      <TextField label="Alt Text" name="alt_text" required hint="Describes the image for screen readers" defaultValue={dv.alt_text as string} error={state.fieldErrors?.alt_text} />
      <TextField label="Title" name="title" hint="Optional" defaultValue={dv.title as string} />
      <TextAreaField label="Caption" name="caption" rows={2} defaultValue={dv.caption as string} />

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField label="Category" name="category" required options={categoryOptions} defaultValue={dv.category as string} />
        <SelectField
          label="Album"
          name="album_id"
          hint="Optional"
          defaultValue={(dv.album_id as string) ?? ""}
          options={[{ value: "", label: "— None —" }, ...albums.map((a) => ({ value: a.id, label: a.name }))]}
        />
        <TextField label="Event Year" name="event_year" type="number" defaultValue={dv.event_year != null ? String(dv.event_year) : ""} />
      </div>

      <SelectField label="Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />

      <SubmitButton>Save Photograph</SubmitButton>
    </form>
  );
}
