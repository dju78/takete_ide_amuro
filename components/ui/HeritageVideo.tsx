"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Fallback-aware video — if the source file isn't there yet, shows a labelled
 * "pending" state instead of a broken player. Mirrors HeritageImage.
 */
export function HeritageVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={cn("flex h-full w-full flex-col items-center justify-center gap-2 bg-purple-50 text-purple-600/50", className)}>
        <Film className="h-8 w-8" aria-hidden="true" />
        <span className="px-4 text-center text-xs font-medium">{label}</span>
      </div>
    );
  }

  return (
    <video
      controls
      preload="none"
      poster={poster}
      className={className}
      onError={() => setFailed(true)}
    >
      <source src={src} />
    </video>
  );
}
