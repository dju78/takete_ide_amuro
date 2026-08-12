"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "done" | "error";

interface FileUploadFieldProps {
  name: string;
  label: string;
  bucket: string;
  accept?: string;
  hint?: string;
  defaultUrl?: string | null;
  required?: boolean;
}

/**
 * Uploads directly to a Supabase Storage bucket from the browser (RLS restricts
 * writes to authenticated staff — see supabase/migrations/0010_storage_buckets.sql)
 * and writes the resulting public URL into a hidden input so it travels with the
 * surrounding <form> the same way a plain text field would.
 */
export function FileUploadField({ name, label, bucket, accept, hint, defaultUrl, required }: FileUploadFieldProps) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setState("uploading");
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setState("error");
      setError("Supabase is not configured in this environment.");
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `${slugify(file.name.replace(/\.[^/.]+$/, ""))}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setState("error");
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setState("done");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal">{label} {required && <span className="text-red-600">*</span>}</label>
      {hint && <p className="mt-0.5 text-xs text-charcoal/50">{hint}</p>}
      <input type="hidden" name={name} value={url} required={required} />

      <div className="mt-1.5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={state === "uploading"}
          className="flex items-center gap-2 rounded-xl border border-dashed border-purple-600/30 bg-purple-50/50 px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-60"
        >
          {state === "uploading" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
          )}
          {state === "uploading" ? "Uploading…" : url ? "Replace file" : "Upload file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        {state === "done" && (
          <span className="flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Uploaded
          </span>
        )}
      </div>

      {url && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-purple-600/10 bg-white p-2">
          {accept?.startsWith("image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-purple-50 text-xs text-purple-600">File</span>
          )}
          <span className="flex-1 truncate text-xs text-charcoal/60">{url}</span>
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setState("idle");
            }}
            aria-label="Remove file"
            className="rounded-full p-1 text-charcoal/50 hover:bg-red-50 hover:text-red-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}
