"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";

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

export function OralHistoryForm({ action, defaultValues }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};
  const topics = Array.isArray(dv.topics) ? (dv.topics as string[]).join(", ") : "";

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Interviewee" name="interviewee" required defaultValue={dv.interviewee as string} error={state.fieldErrors?.interviewee} />
        <TextField label="Interviewer" name="interviewer" defaultValue={dv.interviewer as string} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Interview Date" name="interview_date" type="date" defaultValue={dv.interview_date as string} />
        <TextField label="Topics" name="topics" hint="Comma-separated" defaultValue={topics} />
      </div>

      <FileUploadField name="photo_url" label="Photograph" bucket="oral-history" accept="image/*" defaultUrl={dv.photo_url as string} />
      <div className="grid gap-5 sm:grid-cols-2">
        <FileUploadField name="audio_url" label="Audio Recording" bucket="oral-history" accept="audio/*" defaultUrl={dv.audio_url as string} />
        <FileUploadField name="video_url" label="Video Recording" bucket="oral-history" accept="video/*" defaultUrl={dv.video_url as string} />
      </div>

      <TextAreaField label="Summary" name="summary" rows={3} defaultValue={dv.summary as string} />
      <TextAreaField label="Transcript" name="transcript" rows={8} defaultValue={dv.transcript as string} />
      <TextAreaField label="Verification Notes" name="verification_notes" rows={3} defaultValue={dv.verification_notes as string} />

      <fieldset className="rounded-xl border border-gold-500/30 bg-gold-100/40 p-4">
        <legend className="px-1 text-sm font-semibold text-purple-600">Consent</legend>
        <CheckboxField
          name="consent_confirmed"
          defaultChecked={Boolean(dv.consent_confirmed)}
          label="The interviewee (or their family) consented to this recording being archived and used per its verification/publication status."
        />
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <SelectField label="Publication Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <SubmitButton>Save Oral History</SubmitButton>
    </form>
  );
}
