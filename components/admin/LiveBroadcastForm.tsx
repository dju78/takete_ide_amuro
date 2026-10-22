"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/Button";
import { saveLiveBroadcastAction } from "@/lib/actions/admin-live-broadcast";
import {
  BROADCAST_STATUSES,
  STATUS_LABELS,
  formatReplayLines,
  instantToLagosLocal,
  type LiveBroadcast,
} from "@/lib/live/broadcast";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function LiveBroadcastForm({ broadcast, canSave }: { broadcast: LiveBroadcast; canSave: boolean }) {
  const [state, formAction] = useActionState(saveLiveBroadcastAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && (
        <div
          role={state.status === "error" ? "alert" : "status"}
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 text-sm ${
            state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-600/10 text-green-700"
          }`}
        >
          <span>{state.message}</span>
          {state.status !== "error" && (
            <a href="/live" target="_blank" rel="noopener noreferrer" className="font-medium underline">
              View /live →
            </a>
          )}
        </div>
      )}

      <div className="rounded-xl border border-red-600/20 bg-red-50 p-3 text-sm text-red-800">
        <strong>Public information only.</strong> Everything on this form is shown to the public. Never enter a stream
        key, RTMP server address, password, or a YouTube Studio / Facebook Live Producer link. Stream keys belong only in
        OBS or the multistream service.
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Broadcast status (manual)"
          name="status"
          hint="Set by the operator. The site does not detect this automatically."
          error={state.fieldErrors?.status}
          options={BROADCAST_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
          defaultValue={broadcast.status}
        />
        <TextField
          label="YouTube video ID or public link"
          name="video_id"
          hint="From YouTube Studio → the scheduled stream → Share, e.g. https://youtube.com/live/AbCdEfGhIjK"
          defaultValue={broadcast.videoId ?? ""}
        />
      </div>

      <TextField label="Broadcast title" name="title" defaultValue={broadcast.title} />
      <TextAreaField
        label="Status message (optional)"
        name="status_message"
        rows={2}
        hint="Short public note, e.g. “Day 2 resumes at the next session.”"
        defaultValue={broadcast.statusMessage ?? ""}
      />
      <TextField
        label="Scheduled start (Lagos time, WAT)"
        name="scheduled_start"
        type="datetime-local"
        hint="Leave empty until the start time is confirmed."
        error={state.fieldErrors?.scheduled_start}
        defaultValue={instantToLagosLocal(broadcast.scheduledStart)}
      />
      <CheckboxField label="Show YouTube live chat while live" name="chat_enabled" defaultChecked={broadcast.chatEnabled} />

      <fieldset className="grid gap-5 rounded-xl border border-purple-600/10 p-4 sm:grid-cols-2">
        <legend className="px-1 text-sm font-semibold text-purple-700">Public platform links</legend>
        <TextField label="YouTube channel or watch link" name="youtube_url" defaultValue={broadcast.links.youtube} />
        <TextField label="Facebook Page or video link" name="facebook_url" hint="Public page address only" defaultValue={broadcast.links.facebook ?? ""} />
        <TextField label="Instagram profile (optional)" name="instagram_url" defaultValue={broadcast.links.instagram ?? ""} />
        <TextField label="TikTok profile (optional)" name="tiktok_url" defaultValue={broadcast.links.tiktok ?? ""} />
      </fieldset>

      <TextAreaField
        label="Replays"
        name="replays"
        rows={6}
        hint="One per line: Title | Day (1, 2 or 3) | YouTube or Facebook link"
        defaultValue={formatReplayLines(broadcast.replays)}
      />

      {canSave ? (
        <div>
          <SubmitButton>Save live settings</SubmitButton>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Button type="button" disabled aria-describedby="live-save-unavailable" className="w-full sm:w-auto">
            Saving unavailable
          </Button>
          <p id="live-save-unavailable" className="text-sm text-charcoal/70">
            Settings cannot be saved until the database table exists (see the notice above). The public page is
            using the checked-in configuration shown in this form.
          </p>
        </div>
      )}
    </form>
  );
}
