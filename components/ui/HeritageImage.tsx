"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drop-in replacement for next/image's <Image> that never shows a browser
 * broken-image icon. If the source fails to load (missing file, bad admin
 * upload URL, etc.) it renders a labelled placeholder instead.
 */
export function HeritageImage({ className, alt, label, ...props }: ImageProps & { label?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("flex h-full w-full flex-col items-center justify-center gap-2 bg-purple-50 text-purple-600/50", className)}>
        <Landmark className="h-8 w-8" aria-hidden="true" />
        <span className="px-4 text-center text-xs font-medium">{label ?? "Takete-Ide Heritage Image"}</span>
      </div>
    );
  }

  return <Image className={className} alt={alt} onError={() => setFailed(true)} {...props} />;
}
