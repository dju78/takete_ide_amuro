"use client";

import { useActionState } from "react";
import { TextField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { createAlbumAction } from "@/lib/actions/admin-gallery";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function QuickAddAlbum() {
  const [state, formAction] = useActionState(createAlbumAction, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-purple-600/10 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]" noValidate>
      {state.message && <p className="sm:col-span-3 rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <TextField label="Album Title" name="title" required error={state.fieldErrors?.title} />
      <TextField label="Category" name="category" required error={state.fieldErrors?.category} />
      <div className="flex items-end">
        <SubmitButton>Add Album</SubmitButton>
      </div>
    </form>
  );
}
