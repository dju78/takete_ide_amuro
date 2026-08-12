"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const categoryOptions = [
  "traditional_leaders", "community_leaders", "public_service", "academia", "education", "healthcare",
  "business", "entrepreneurship", "arts_culture", "sports", "diaspora", "young_achievers",
].map((c) => ({ value: c, label: c.replace(/_/g, " ") }));

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

export function PersonForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};
  const links = Array.isArray(dv.external_links)
    ? (dv.external_links as { label: string; url: string }[]).map((l) => `${l.label} | ${l.url}`).join("\n")
    : "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={dv.name as string} error={state.fieldErrors?.name} />
        <SelectField label="Category" name="category" required options={categoryOptions} defaultValue={dv.category as string} />
      </div>
      <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} />

      <FileUploadField name="photo_url" label="Photograph" bucket="people" accept="image/*" defaultUrl={dv.photo_url as string} />
      <TextAreaField label="Biography" name="biography" rows={6} defaultValue={dv.biography as string} />
      <TextAreaField label="Achievements" name="achievements" rows={3} defaultValue={dv.achievements as string} />
      <TextAreaField label="External Links" name="external_links" rows={3} hint="One per line: Label | https://…" defaultValue={links} />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <SelectField label="Publication Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <SubmitButton>Save Profile</SubmitButton>
    </form>
  );
}
