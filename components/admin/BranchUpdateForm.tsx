"use client";

import { useActionState } from "react";
import { TextField, TextAreaField, SelectField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { createBranchUpdateAction } from "@/lib/actions/admin-tipu-branches";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

/**
 * Adds a piece of branch news or a branch event. The branch card shows the most
 * recent published news item as its "latest activity" and the next future event
 * as its "upcoming event".
 */
export function BranchUpdateForm({ branchSlug }: { branchSlug: string }) {
  const [state, formAction] = useActionState(createBranchUpdateAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl border border-purple-600/10 bg-white p-5 sm:grid-cols-2" noValidate>
      {state.message && (
        <p className="rounded-lg bg-red-100 p-2 text-xs text-red-700 sm:col-span-2">{state.message}</p>
      )}
      <input type="hidden" name="branch_slug" value={branchSlug} />

      <div className="sm:col-span-2">
        <TextField label="Title" name="title" required error={state.fieldErrors?.title} />
      </div>
      <SelectField
        label="Type"
        name="kind"
        required
        defaultValue="news"
        options={[
          { value: "news", label: "News — something that happened" },
          { value: "event", label: "Event — something coming up" },
        ]}
      />
      <TextField label="Date" name="occurs_on" type="date" hint="Leave blank if not confirmed" />
      <div className="sm:col-span-2">
        <TextAreaField label="Details" name="body" rows={2} />
      </div>
      <SelectField
        label="Status"
        name="status"
        required
        defaultValue="published"
        options={[
          { value: "published", label: "Published" },
          { value: "draft", label: "Draft" },
        ]}
      />
      <div className="flex items-end sm:col-span-2">
        <SubmitButton>Add to branch</SubmitButton>
      </div>
    </form>
  );
}
