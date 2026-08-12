"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ action, label }: { action: () => Promise<void>; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-xs">
        Delete this {label}?
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => action())}
          className="font-semibold text-red-600 hover:underline"
        >
          Yes
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="text-charcoal/60 hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 text-red-600 hover:underline"
      aria-label={`Delete ${label}`}
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      Delete
    </button>
  );
}
