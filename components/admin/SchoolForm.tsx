"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

const schoolTypeOptions = [
  { value: "public", label: "Public" },
  { value: "community", label: "Community" },
  { value: "mission", label: "Mission" },
  { value: "private", label: "Private" },
];

const schoolLevelOptions = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "nursery_primary", label: "Nursery & Primary" },
  { value: "vocational", label: "Vocational & Digital" },
];

const verificationOptions = [
  { value: "unverified", label: "Unverified" },
  { value: "oral_history", label: "Oral History" },
  { value: "community_tradition", label: "Community Tradition" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "verified", label: "Verified" },
  { value: "community_record", label: "Community Record" },
  { value: "disputed", label: "Disputed" },
];

interface Props {
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaultValues?: Record<string, unknown>;
}

const initialState: AdminFormState = { status: "idle" };

export function SchoolForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  const facilitiesText = Array.isArray(dv.facilities) ? (dv.facilities as string[]).join("\n") : (dv.facilities as string) || "";
  const needsText = Array.isArray(dv.community_needs) ? (dv.community_needs as string[]).join("\n") : (dv.community_needs as string) || "";
  const projectsText = Array.isArray(dv.current_projects) ? (dv.current_projects as string[]).join("\n") : (dv.current_projects as string) || "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="School Name" name="name" required defaultValue={dv.name as string} error={state.fieldErrors?.name} />
        <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField label="School Type" name="school_type" required options={schoolTypeOptions} defaultValue={(dv.school_type as string) ?? "public"} />
        <SelectField label="Education Level" name="level" required options={schoolLevelOptions} defaultValue={(dv.level as string) ?? "secondary"} />
        <TextField label="Year Established" name="year_established" type="number" defaultValue={dv.year_established != null ? String(dv.year_established) : ""} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Location" name="location" defaultValue={(dv.location as string) ?? "Takete-Ide"} />
        <TextField label="Current Principal / Head" name="current_head" defaultValue={dv.current_head as string} hint="Leave blank if not verified from official register" />
        <TextField label="Approx. Enrolment" name="approximate_enrolment" type="number" defaultValue={dv.approximate_enrolment != null ? String(dv.approximate_enrolment) : ""} />
      </div>

      <TextAreaField label="Historical Background & Description" name="historical_description" rows={3} defaultValue={dv.historical_description as string} />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextAreaField label="Facilities (one per line)" name="facilities" rows={4} defaultValue={facilitiesText} />
        <TextAreaField label="Priority Community Needs (one per line)" name="community_needs" rows={4} defaultValue={needsText} />
        <TextAreaField label="Current Projects (one per line)" name="current_projects" rows={4} defaultValue={projectsText} />
      </div>

      <div className="border-t border-purple-600/10 pt-5">
        <h3 className="font-serif text-base font-bold text-purple-900 mb-4">Provenance &amp; Verification</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="Source Title" name="source_title" defaultValue={dv.source_title as string} />
          <TextField label="Source Author / Contributor" name="source_author" defaultValue={dv.source_author as string} />
          <TextField label="Source Date" name="source_date" defaultValue={dv.source_date as string} />
        </div>
        <div className="grid gap-5 sm:grid-cols-4 mt-4">
          <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={(dv.verification_status as string) ?? "verified"} />
          <TextField label="Verified By" name="verified_by" defaultValue={dv.verified_by as string} />
          <TextField label="Last Verified Date" name="last_verified_at" type="date" defaultValue={dv.last_verified_at as string} />
          <TextField label="Display Order" name="display_order" type="number" defaultValue={dv.display_order != null ? String(dv.display_order) : "0"} />
        </div>
      </div>

      <SubmitButton>Save School</SubmitButton>
    </form>
  );
}
