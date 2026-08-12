import type { z } from "zod";

/** First error message per field, for wiring into form field `error` props. */
export function flattenZodError(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export interface AdminFormState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}
