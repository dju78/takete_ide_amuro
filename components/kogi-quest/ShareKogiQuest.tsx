"use client";

import { useState } from "react";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";

export function ShareKogiQuest() {
  const [copied, setCopied] = useState(false);

  const shareTitle = "Kogi Quest | Test Your Knowledge of Kogi State";
  const shareText =
    "How well do you know Kogi State? Take the Kogi Quest challenge, test your knowledge and see if you can become a Legend of the Confluence!";
  const shareUrl = "https://takete-ide.org/kogi-quest";

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // Dismissed or fallback
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // Fallback
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n\n${shareUrl}`
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Share Kogi Quest challenge on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Share on WhatsApp
      </a>

      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Challenge Your Friends
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border border-charcoal/20 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal shadow-sm transition hover:bg-ivory focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Copy Kogi Quest link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span className="text-green-700 font-medium">Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-charcoal/70" aria-hidden="true" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
