import { ShieldCheck, Info } from "lucide-react";

export function PrivacyNotice({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-purple-600/15 bg-white/90 p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-community-green mt-0.5" aria-hidden="true" />
        <div className="space-y-1.5 text-xs sm:text-sm text-charcoal/80">
          <p className="font-semibold text-purple-950">
            Privacy &amp; Data Security Guarantee
          </p>
          <p className="leading-relaxed">
            Your photograph is processed entirely within your web browser and is{" "}
            <strong className="text-purple-900">never uploaded to our servers or permanently stored</strong>.
            All poster composition and rendering happens locally on your device.
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] sm:text-xs text-charcoal/70">
            <Info className="h-3.5 w-3.5 shrink-0 text-gold-700" aria-hidden="true" />
            <span>
              Posters are created by community members for celebratory and social media purposes and do not automatically represent an official appointment, title, or institutional endorsement.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
