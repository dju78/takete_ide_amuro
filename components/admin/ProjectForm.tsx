"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const categoryOptions = [
  "roads_access", "education", "healthcare", "water", "electricity",
  "civic_infrastructure", "ict_digital", "youth_development",
].map((c) => ({ value: c, label: c.replace(/_/g, " ") }));

const statusOptions = ["proposed", "planning", "fundraising", "in_progress", "completed", "on_hold"].map((s) => ({
  value: s,
  label: s.replace(/_/g, " "),
}));

const verificationOptions = [
  { value: "unverified", label: "Unverified" },
  { value: "oral_history", label: "Oral History" },
  { value: "community_tradition", label: "Community Tradition" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "verified", label: "Verified" },
  { value: "disputed", label: "Disputed" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaultValues?: Record<string, unknown>;
  defaultImageUrl?: string;
}

const initialState: AdminFormState = { status: "idle" };

export function ProjectForm({ action, defaultValues, defaultImageUrl }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Title" name="title" required defaultValue={dv.title as string} error={state.fieldErrors?.title} />
        <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Category" name="category" required options={categoryOptions} defaultValue={dv.category as string} />
        <SelectField label="Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <TextAreaField label="Description" name="description" rows={4} defaultValue={dv.description as string} />
      <TextAreaField label="Objective" name="objective" rows={3} defaultValue={dv.objective as string} />

      <FileUploadField name="image_url" label="Project Image" bucket="projects" accept="image/*" defaultUrl={defaultImageUrl} hint="Only used when adding the first image for this project" />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Location" name="location" defaultValue={dv.location as string} />
        <TextField label="Start Date" name="start_date" type="date" defaultValue={dv.start_date as string} />
        <TextField label="Expected Completion" name="expected_completion" type="date" defaultValue={dv.expected_completion as string} />
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <TextField label="Budget" name="budget" type="number" defaultValue={dv.budget != null ? String(dv.budget) : ""} />
        <TextField label="Amount Raised" name="amount_raised" type="number" defaultValue={dv.amount_raised != null ? String(dv.amount_raised) : ""} />
        <TextField label="Funding Target" name="funding_target" type="number" defaultValue={dv.funding_target != null ? String(dv.funding_target) : ""} />
        <TextField label="Currency" name="currency" defaultValue={(dv.currency as string) ?? "NGN"} />
      </div>
      <p className="text-xs text-charcoal/50">Only show financial figures when supplied by administrators — leave blank rather than estimating.</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Funding Source" name="funding_source" defaultValue={dv.funding_source as string} />
        <TextField label="Responsible Organisation" name="responsible_organisation" defaultValue={dv.responsible_organisation as string} />
      </div>

      <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />

      <SubmitButton>Save Project</SubmitButton>
    </form>
  );
}
