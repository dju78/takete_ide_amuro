import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CelebrationStudio } from "@/components/celebration-studio/CelebrationStudio";
import { siteConfig } from "@/lib/site-config";
import { Sparkles, CalendarDays, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Takete-Ide Celebration Studio | Centenary 2026 Poster Creator",
  description:
    "Design and download your high-resolution Takete-Ide Centenary 2026 commemorative poster. Choose professional ceremonial templates, add your photograph and share on WhatsApp, Facebook, Instagram or print.",
  alternates: {
    canonical: `${siteConfig.url}/centenary/celebration-studio`,
  },
  openGraph: {
    title: "Takete-Ide Celebration Studio — Create Your Centenary 2026 Poster",
    description:
      "Join the 100-year celebration of Takete-Ide heritage (1926–2026). Create personalised commemorative posters privately in your browser.",
    url: `${siteConfig.url}/centenary/celebration-studio`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/takete-ide/tipu-emblem.png`,
        width: 800,
        height: 800,
        alt: "Takete-Ide Centenary Celebration Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Takete-Ide Celebration Studio — Centenary 2026 Poster Creator",
    description:
      "Create and download your high-resolution Takete-Ide Centenary 2026 commemorative poster. 100% private, client-side on your device.",
  },
};

export default function CelebrationStudioPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden bg-purple-700 py-10 text-white sm:py-14 lg:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Centenary 2026", href: "/centenary" },
              { label: "Celebration Studio" },
            ]}
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              Takete-Ide Celebration Studio
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/15">
              <CalendarDays className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              Centenary 2026 (29–31 October 2026)
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-community-green/40 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-emerald-400/30">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
              100% Private On-Device Processing
            </span>
          </div>

          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Takete-Ide Centenary Celebration Studio
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            Create and download your high-resolution commemorative poster for the historic 100-year Centenary Celebration. Choose a ceremonial template, upload your photo, personalise your felicitation message, and share across WhatsApp, Facebook, Instagram, or print.
          </p>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-500 via-community-green to-gold-500" />
      </div>

      {/* Main Studio Container */}
      <Container className="py-8 sm:py-12">
        <CelebrationStudio />
      </Container>
    </div>
  );
}
