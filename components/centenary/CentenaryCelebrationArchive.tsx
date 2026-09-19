import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProvenanceCard } from "@/components/ui/ProvenanceCard";

interface Props {
  className?: string;
}

export function CentenaryCelebrationArchive({ className = "" }: Props) {
  return (
    <div className={`space-y-16 ${className}`}>
      {/* Archive Hero Banner */}
      <section className="rounded-3xl border border-gold-500/30 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950 p-8 text-white shadow-xl sm:p-10 lg:p-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
            Official Celebration Archive
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl text-white">
            Takete-Ide Centenary 2026 — Relive the Historic Celebration
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
            A historic milestone marking one century at the present settlement (1926–2026). This archive records the addresses, honour rolls, developmental milestones, multimedia recordings, and community resolutions from the 3-day centenary commemoration (29–31 October 2026).
          </p>
        </div>
      </section>

      {/* Speeches and addresses */}
      <section id="speeches" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Speeches & Addresses"
          title="Speeches and addresses"
          align="left"
          className="mx-0"
          description="Transcripts and addresses from the centenary celebration will be archived here once officially verified."
        />
        <div className="mt-8 rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm">
          <EmptyState
            compact
            tone="purple"
            title="Speeches and addresses are being prepared"
            message="Transcripts and verified addresses from the event will appear here following editorial review."
          />
        </div>
      </section>

      {/* Awards and recognition */}
      <section id="awards" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Honour Roll"
          title="Awards and recognition"
          align="left"
          className="mx-0"
          description="Recognitions and honours presented in connection with the centenary celebration."
        />
        <div className="mt-8 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm">
          <EmptyState
            tone="gold"
            title="Awards and recognition register"
            message="Verified recognition lists will be documented here once compiled and approved."
            action={{
              label: "View Our People Directory",
              href: "/our-people",
            }}
          />
        </div>
      </section>

      {/* Projects announced */}
      <section id="projects" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Development"
          title="Projects announced"
          align="left"
          className="mx-0"
          description="Community development initiatives and projects associated with the centenary milestone."
        />
        <div className="mt-8 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm">
          <p className="text-sm text-charcoal/80 mb-6">
            Explore approved community projects across infrastructure, education, and civic amenities.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/development"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Explore Development Projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="scroll-mt-24 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Publications
            </span>
            <h3 className="mt-4 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
              Historical Publications &amp; Digital Archive
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
              Community historical publications, archival manuscripts, and lineage records preserved for Takete-Ide.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/archive"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-community-green hover:underline"
              >
                Access Digital Archive →
              </Link>
              <Link
                href="/our-story"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:underline"
              >
                Read Migration History →
              </Link>
            </div>
          </div>

          <div>
            <ProvenanceCard
              provenance={{
                source_title: "Takete-Ide Centenary 2026 Central Planning Committee Records",
                source_author: "Centenary Documentation & Archive Subcommittee",
                source_date: "2026",
                verified_by: "TIPU National Executive Council",
                last_verified_at: "2026-11-01",
                verification_status: "verified",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
