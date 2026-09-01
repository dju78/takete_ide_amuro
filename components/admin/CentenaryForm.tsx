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
        <div
          className={`flex items-center justify-between gap-3 rounded-xl p-3 text-sm ${
            state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"
          }`}
        >
          <span>{state.message}</span>
          {state.status !== "error" && (
            <a
              href="/centenary"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-green-900"
            >
              View public page →
            </a>
          )}
        </div>
      )}

      <TextField label="Headline" name="headline" defaultValue={centenary.headline} />
      <TextAreaField label="Introduction" name="intro" rows={3} defaultValue={centenary.intro} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Overall event period"
          name="event_dates"
          hint="e.g. “29–31 October 2026”"
          defaultValue={centenary.eventDates}
        />
        <TextField
          label="Celebration theme"
          name="theme"
          hint="e.g. “FAITH, UNITY AND PROGRESS”"
          defaultValue={centenary.theme}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField
          label="Main event date"
          name="event_date"
          type="date"
          hint="Drives the countdown"
          defaultValue={centenary.eventDate}
        />
        <TextField
          label="Main date label"
          name="event_time_label"
          hint="e.g. “Saturday, 31 October 2026”"
          defaultValue={centenary.eventDateLabel}
        />
        <TextField
          label="Main event time"
          name="main_event_time"
          hint="e.g. “10:00 AM Prompt”"
          defaultValue={centenary.mainEventTime}
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
