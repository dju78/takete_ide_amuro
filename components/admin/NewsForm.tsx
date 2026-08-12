"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/actions/admin-news";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "verified", label: "Verified" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    featured_image?: string;
    featured_image_alt?: string;
    status?: string;
  };
}

const initialState: AdminFormState = { status: "idle" };

export function NewsForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.message && (
        <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>
      )}
      <TextField label="Title" name="title" required defaultValue={defaultValues?.title} error={state.fieldErrors?.title} />
      <TextField label="Slug" name="slug" hint="Leave blank to auto-generate from title" defaultValue={defaultValues?.slug} error={state.fieldErrors?.slug} />
      <TextAreaField label="Excerpt" name="excerpt" rows={2} defaultValue={defaultValues?.excerpt} error={state.fieldErrors?.excerpt} />
      <TextAreaField label="Body (Markdown supported)" name="body" required rows={12} defaultValue={defaultValues?.body} error={state.fieldErrors?.body} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Featured Image URL" name="featured_image" hint="Supabase Storage public URL" defaultValue={defaultValues?.featured_image} error={state.fieldErrors?.featured_image} />
        <TextField label="Featured Image Alt Text" name="featured_image_alt" defaultValue={defaultValues?.featured_image_alt} error={state.fieldErrors?.featured_image_alt} />
      </div>
      <SelectField label="Status" name="status" required options={statusOptions} defaultValue={defaultValues?.status} error={state.fieldErrors?.status} />
      <SubmitButton>Save Article</SubmitButton>
    </form>
  );
}
