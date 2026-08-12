import { CheckCircle2, AlertCircle } from "lucide-react";
import type { FormState } from "@/lib/actions/submissions";

export function FormStatusMessage({ state }: { state: FormState }) {
  if (state.status === "idle") return null;
  const isSuccess = state.status === "success";
  return (
    <div
      role="status"
      className={`flex items-start gap-2 rounded-xl p-4 text-sm ${isSuccess ? "bg-green-600/10 text-green-700" : "bg-red-100 text-red-700"}`}
    >
      {isSuccess ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
      <p>{state.message}</p>
    </div>
  );
}
