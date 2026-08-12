"use client";

import { useActionState } from "react";
import { TextField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { createCouncilMemberAction } from "@/lib/actions/admin-traditional-institution";
import type { AdminFormState } from "@/lib/zod-helpers";

const initialState: AdminFormState = { status: "idle" };

export function QuickAddCouncilMember() {
  const [state, formAction] = useActionState(createCouncilMemberAction, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-purple-600/10 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]" noValidate>
      {state.message && <p className="sm:col-span-3 rounded-lg bg-red-100 p-2 text-xs text-red-700">{state.message}</p>}
      <TextField label="Full Name" name="full_name" required error={state.fieldErrors?.full_name} />
      <TextField label="Title" name="title" required error={state.fieldErrors?.title} />
      <div className="flex items-end">
        <SubmitButton>Add</SubmitButton>
      </div>
    </form>
  );
}
