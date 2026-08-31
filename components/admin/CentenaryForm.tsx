"use client";

import { useActionState } from "react";
import { TextField, TextAreaField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { updateCentenaryAction } from "@/lib/actions/admin-community-programme";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { CentenaryDetails } from "@/lib/media/community-programme";

const initialState: AdminFormState = { status: "idle" };

export function CentenaryForm({ centenary }: { centenary: CentenaryDetails }) {
  const [state, formAction] = useActionState(updateCentenaryAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && (
        <p
          className={`rounded-xl p-3 text-sm ${
            state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <TextField label="Headline" name="headline" defaultValue={centenary.headline} />
      <TextAreaField label="Introduction" name="intro" rows={3} defaultValue={centenary.intro} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Event date"
          name="event_date"
          type="date"
          hint="Drives the countdown"
          defaultValue={centenary.eventDate}
        />
        <TextField
          label="Date label"
          name="event_time_label"
          hint="How the date reads publicly, e.g. “Saturday, 31 October 2026”"
          defaultValue={centenary.eventDateLabel}
        />
      </div>
      <TextField label="Venue" name="venue" defaultValue={centenary.venue} />

      <TextAreaField
        label="Programme status"
        name="programme_status"
        rows={2}
        hint="Shown while the programme is unpublished. Do not invent programme content."
        defaultValue={centenary.programmeStatus}
      />
      <TextField
        label="Programme document URL"
        name="programme_document_url"
        hint="Optional — link to the published programme once approved"
      />
      <TextAreaField
        label="Attire status"
        name="attire_status"
        rows={2}
        hint="Shown under “Centenary 2026 Official Attire” until the committee confirms it."
        defaultValue={centenary.attireStatus}
      />

      <SubmitButton>Save Centenary details</SubmitButton>
    </form>
  );
}
