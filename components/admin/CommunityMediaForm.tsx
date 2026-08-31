"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { GALLERY_CATEGORIES } from "@/lib/media/gallery-categories";
import type { AdminFormState } from "@/lib/zod-helpers";
import type { ResolvedMediaItem } from "@/lib/data/community-media";

const categoryOptions = GALLERY_CATEGORIES.map((c) => ({ value: c, label: c }));

const verificationOptions = [
  { value: "community-record", label: "Community record — as supplied by the archive" },
  { value: "verified", label: "Verified — confirmed against a source" },
  { value: "pending-verification", label: "Pending verification — something is still unconfirmed" },
];

const initialState: AdminFormState = { status: "idle" };

export function CommunityMediaForm({
  item,
  action,
}: {
  item: ResolvedMediaItem;
  action: (prevState: AdminFormState, formData: FormData) => Promise<AdminFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      {state.message && <p className="rounded-xl bg-red-100 p-3 text-sm text-red-700">{state.message}</p>}

      <TextField label="Title" name="title" defaultValue={item.title} error={state.fieldErrors?.title} />
      <TextAreaField label="Description / caption" name="description" rows={3} defaultValue={item.description} />
      <TextField
        label="Alt text"
        name="alt_text"
        hint="Describes the image for screen readers. Describe what is visible — do not name individuals."
        defaultValue={item.altText}
        error={state.fieldErrors?.alt_text}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Category" name="category" options={categoryOptions} defaultValue={item.category} />
        <TextField label="Event" name="event_label" hint="Groups items into one story page" defaultValue={item.event ?? ""} />
        <TextField label="Branch / chapter" name="branch" defaultValue={item.branch ?? ""} />
        <TextField label="Location" name="location" hint="Only as precise as the record supports" defaultValue={item.location ?? ""} />
        <TextField
          label="Event date"
          name="event_date"
          type="date"
          hint="Use only when the exact day is known"
          defaultValue={item.eventDate ?? ""}
        />
        <TextField
          label="Event period"
          name="event_period"
          hint="Used when only the month is known, e.g. “August 2026”"
          defaultValue={item.eventPeriod ?? ""}
        />
      </div>

      <fieldset className="rounded-2xl border border-purple-600/10 bg-purple-50/40 p-5">
        <legend className="px-2 text-sm font-semibold text-purple-600">Verification &amp; names</legend>
        <div className="flex flex-col gap-5">
          <SelectField
            label="Verification status"
            name="verification_status"
            options={verificationOptions}
            defaultValue={item.verificationStatus}
          />
          <TextAreaField
            label="What is still unconfirmed"
            name="verification_note"
            rows={2}
            hint="Shown to visitors only when the status is “pending verification”."
            defaultValue={item.verificationNote ?? ""}
          />
          <TextField
            label="Verified names"
            name="verified_names"
            hint="Leave blank unless the community has confirmed who is pictured AND agreed to publication."
            defaultValue={item.verifiedNames ?? ""}
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 rounded-2xl border border-purple-600/10 bg-white p-5">
        <CheckboxField
          name="published"
          defaultChecked={item.published}
          label={
            <>
              <span className="font-medium text-charcoal">Published</span> — visible to visitors. Unticking
              removes it from the gallery and every story page immediately.
            </>
          }
        />
        <CheckboxField
          name="featured"
          defaultChecked={item.featured}
          label={
            <>
              <span className="font-medium text-charcoal">Featured</span> — eligible for the homepage photo
              strip.
            </>
          }
        />
      </div>

      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}
