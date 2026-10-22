"use client";

import { useRef, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { useBrowserValue } from "@/components/live/use-browser";

const WHATSAPP_ICON_PATH =
  "M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.43 9.43 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.45-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.45 9.43m8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.6 23.62l6.02-1.58a11.33 11.33 0 0 0 5.43 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04";

export function ShareControls({ url, text }: { url: string; text: string }) {
  const canNativeShare = useBrowserValue(() => typeof navigator.share === "function");
  const [copied, setCopied] = useState<"idle" | "copied" | "manual">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  async function nativeShare() {
    try {
      await navigator.share({ title: text, text, url });
    } catch {
      // The viewer closed the share sheet — nothing to do.
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied("copied");
    } catch {
      // Clipboard blocked (older browser, insecure context): select the text instead.
      setCopied("manual");
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }

  const buttonClass =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClass} bg-[#25d366] text-[#073e1f] hover:bg-[#1fb557]`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d={WHATSAPP_ICON_PATH} />
          </svg>
          Share on WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        {canNativeShare && (
          <button type="button" onClick={nativeShare} className={`${buttonClass} bg-purple-600 text-white hover:bg-purple-400`}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share…
          </button>
        )}
        <button
          type="button"
          onClick={copyLink}
          className={`${buttonClass} bg-white text-purple-700 ring-1 ring-inset ring-purple-600/30 hover:bg-purple-50`}
        >
          {copied === "copied" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied === "copied" ? "Link copied" : "Copy link"}
        </button>
      </div>
      <label className="flex flex-col gap-1 text-xs text-charcoal/70">
        <span>{copied === "manual" ? "Copying is blocked in this browser — press Ctrl+C / ⌘C, or long-press to copy:" : "Live page address"}</span>
        <input
          ref={inputRef}
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full max-w-md rounded-xl border border-purple-600/20 bg-white px-3 py-2 text-sm text-charcoal"
        />
      </label>
      <p className="sr-only" role="status" aria-live="polite">
        {copied === "copied" ? "Link copied to clipboard" : ""}
      </p>
    </div>
  );
}
