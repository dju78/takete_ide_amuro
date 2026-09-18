import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_CHAPTERS,
  BOOK_EDITORIAL_NOTE,
} from "@/content/history/web/from-hilltops-to-valley-expanded";
import {
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

export const metadata: Metadata = {
  title: "From the Hilltops to the Valley — Community History Manuscript",
  description:
    "A chapter-by-chapter digital guide to the Takete-Ide community history manuscript and the website sections built from it.",
  alternates: {
    canonical: `${siteConfig.url}/archive/from-hilltops-to-the-valley`,
  },
};

const chapterLinks: Record<number, { label: string; href: string }> = {
  1: { label: "Amuro, Yagba and Okun context", href: "/heritage/amuro-okun-context" },
  2: { label: "Our Story and migration", href: "/our-story" },
  3: { label: "Faith and indigenous heritage", href: "/heritage/faith" },
  4: { label: "Faith and missionary history", href: "/heritage/faith/manuscript-milestones" },
  5: { label: "Early Christian manuscript milestones", href: "/heritage/faith/manuscript-milestones" },
  6: { label: "Takete-Tedo / Okegada", href: "/our-story/takete-tedo" },
  7: { label: "Education and health history", href: "/education" },
  8: { label: "Growth of faith", href: "/heritage/faith/manuscript-milestones" },
  9: { label: "Traditional Council and chieftaincy", href: "/heritage/traditional-council" },
  10: { label: "Pacesetters and firsts", href: "/heritage/pacesetters" },
  11: { label: "Development history", href: "/development" },
  12: { label: "Festivals", href: "/heritage/festivals" },
  13: { label: "Community organisations", href: "/heritage/community-organisations" },
};

export default function ManuscriptArchivePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Digital Archive", href: "/archive" },
              { label: "Community History Manuscript" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Historical source guide</p>
              <h1 className="mt-2 max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
                From the Hilltops to the Valley
              </h1>
              <p className="mt-3 max-w-3xl text-white/85">
                The History, Heritage and People of Takete Ide — organised here as a digital guide to the
                manuscript and the parts of the website developed from it.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-14 sm:py-16">
        <section className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-community-green" aria-hidden="true" />
            <div>
              <h2 className="font-serif text-xl font-bold text-purple-950">Editorial use of the manuscript</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                {BOOK_EDITORIAL_NOTE}
              </p>
              <p className="mt-2 text-xs italic leading-relaxed text-charcoal/60">
                Source: {BOOK_SOURCE_TITLE}. {BOOK_SOURCE_NOTE}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">The thirteen chapters</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/75">
            These are concise summaries rather than a replacement for the manuscript. Each chapter points to
            the part of the website where its Takete-Ide history is being preserved in a structured form.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {BOOK_CHAPTERS.map((chapter) => {
              const destination = chapterLinks[chapter.number];
              return (
                <article key={chapter.number} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-100 font-serif text-sm font-bold text-gold-900">
                      {chapter.number}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-purple-950">{chapter.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{chapter.summary}</p>
                  {destination && (
                    <Link
                      href={destination.href}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-community-green hover:underline"
                    >
                      {destination.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </Container>
    </div>
  );
}
