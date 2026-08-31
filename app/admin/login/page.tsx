"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Logo } from "@/components/layout/Logo";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { TextField } from "@/components/forms/FormField";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-700 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center font-serif text-xl font-bold text-purple-600">Admin Sign In</h1>
        <p className="mt-1 text-center text-sm text-charcoal/60">Staff and administrators only.</p>

        <form action={formAction} className="mt-6 flex flex-col gap-4" noValidate>
          {state.error && (
            <div role="alert" className="flex items-center gap-2 rounded-xl bg-red-100 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              {state.error}
            </div>
          )}
          <TextField label="Email" name="email" type="email" required />
          <TextField label="Password" name="password" type="password" required />
          <SubmitButton>Sign In</SubmitButton>
        </form>
      </div>
    </div>
  );
}
