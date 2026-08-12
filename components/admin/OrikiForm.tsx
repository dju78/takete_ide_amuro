"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { FileUploadField } from "@/components/admin/FileUploadField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { SelectOption } from "@/lib/data/admin";

const verificationOptions = [
  { value: "draft", label: "Draft" },
  { value: "family_submitted", label: "Family Submitted" },
  { value: "oral_history", label: "Oral History" },
  { value: "documentary_evidence", label: "Documentary Evidence" },
  { value: "community_reviewed", label: "Community Reviewed" },
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
  families: SelectOption[];
  compounds: SelectOption[];
  defaultValues?: Record<string, unknown>;
  defaultAudioUrl?: string;
  defaultVideoUrl?: string;
}

const initialState: AdminFormState = { status: "idle" };

export function OrikiForm({ action, families, compounds, defaultValues, defaultAudioUrl, defaultVideoUrl }: Props) {
  const [state, formAction] = useActionState(action, initialState);
  const dv = defaultValues ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Title" name="title" required defaultValue={dv.title as string} error={state.fieldErrors?.title} />
        <TextField label="Slug" name="slug" hint="Leave blank to auto-generate" defaultValue={dv.slug as string} error={state.fieldErrors?.slug} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Family"
          name="family_id"
          hint="Optional — leave blank if not tied to one family"
          defaultValue={(dv.family_id as string) ?? ""}
          options={[{ value: "", label: "— None —" }, ...families.map((f) => ({ value: f.id, label: f.name }))]}
        />
        <SelectField
          label="Compound"
          name="compound_id"
          hint="Optional"
          defaultValue={(dv.compound_id as string) ?? ""}
          options={[{ value: "", label: "— None —" }, ...compounds.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <TextField label="Language" name="language" required defaultValue={(dv.language as string) ?? "Yoruba"} error={state.fieldErrors?.language} />
      </div>

      <TextAreaField
        label="Original Oríkì Text"
        name="original_text"
        required
        rows={6}
        hint="Preserve the exact original wording — never rewritten or auto-translated"
        defaultValue={dv.original_text as string}
        error={state.fieldErrors?.original_text}
      />
      <TextAreaField label="Transliteration" name="transliteration" rows={4} defaultValue={dv.transliteration as string} />
      <TextAreaField label="English Interpretation" name="english_interpretation" rows={4} hint="Kept separate from the original text" defaultValue={dv.english_interpretation as string} />
      <TextAreaField label="Cultural Notes" name="cultural_notes" rows={3} defaultValue={dv.cultural_notes as string} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FileUploadField name="audio_url" label="Audio Recitation" bucket="oriki" accept="audio/*" defaultUrl={defaultAudioUrl} />
        <FileUploadField name="video_url" label="Video Recitation" bucket="oriki" accept="video/*" defaultUrl={defaultVideoUrl} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Performer / Reciter" name="performer" defaultValue={dv.performer as string} />
        <TextField label="Recording Date" name="recording_date" type="date" defaultValue={dv.recording_date as string} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Source" name="source" hint="Who told you this, or where does it come from?" defaultValue={dv.source as string} />
        <TextField label="Contributor" name="contributor" defaultValue={dv.contributor as string} />
      </div>
      <TextField label="Copyright / Usage Notes" name="copyright_notes" defaultValue={dv.copyright_notes as string} />

      <fieldset className="rounded-xl border border-gold-500/30 bg-gold-100/40 p-4">
        <legend className="px-1 text-sm font-semibold text-purple-600">Consent &amp; Permission</legend>
        <div className="mt-2 flex flex-col gap-3">
          <CheckboxField
            name="consent_confirmed"
            defaultChecked={Boolean(dv.consent_confirmed)}
            label="The performer/family consented to this recording being archived."
          />
          <TextField label="Consent Notes" name="consent_notes" hint="Who gave consent, and how it was recorded" defaultValue={dv.consent_notes as string} />
          <CheckboxField
            name="publication_permission"
            defaultChecked={Boolean(dv.publication_permission)}
            label="Permission has been given to publish this Oríkì publicly on the website."
          />
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Verification Status" name="verification_status" required options={verificationOptions} defaultValue={dv.verification_status as string} />
        <SelectField label="Publication Status" name="status" required options={statusOptions} defaultValue={dv.status as string} />
      </div>

      <SubmitButton>Save Oríkì</SubmitButton>
    </form>
  );
}
