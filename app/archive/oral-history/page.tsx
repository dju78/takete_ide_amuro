import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mic2, User, Users, ScrollText, Calendar, MapPin, Globe, Sparkles, BookOpen, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VerificationBadge } from "@/components/ui/Badge";
import { AudioPlayer } from "@/components/heritage/AudioPlayer";
import { ButtonLink } from "@/components/ui/Button";
import { LastUpdated } from "@/components/ui/LastUpdated";
import { formatDate } from "@/lib/utils";
import { getOralHistories } from "@/lib/data/archive";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Voices of Takete-Ide — Oral History & Testimony Archive",
  description: "Help preserve the memories of Takete-Ide Amuro elders and knowledge-holders: recommend someone to interview or share a recollection.",
  alternates: {
    canonical: `${siteConfig.url}/archive/oral-history`,
  },
  openGraph: {
    title: "Voices of Takete-Ide — Oral History Archive",
    description: "Help preserve the memories of Takete-Ide Amuro elders and knowledge-holders: recommend someone to interview or share a recollection.",
    url: `${siteConfig.url}/archive/oral-history`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voices of Takete-Ide — Oral History Archive",
    description: "Help preserve the memories of Takete-Ide Amuro elders and knowledge-holders: recommend someone to interview or share a recollection.",
  },
};

export const revalidate = 3600;

const contributionRoutes = [
  {
    icon: Mic2,
    title: "Recommend an elder",
    description: "Suggest someone whose memories of Takete-Ide should be recorded, with their and their family’s agreement.",
    href: "/get-involved",
    cta: "Recommend an elder",
  },
  {
    icon: Users,
    title: "Share a family history",
    description: "Send a family’s story, compound history or lineage for review with the family concerned.",
    href: "/families/contribute",
    cta: "Share a family history",
  },
  {
    icon: ScrollText,
    title: "Contribute an Oríkì",
    description: "Share a family praise name or recitation for the Oríkì directory.",
    href: "/oriki/contribute",
    cta: "Contribute an Oríkì",
  },
];

export default async function OralHistoryPage() {
  const histories = await getOralHistories();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Digital Archive", href: "/archive" }, { label: "Voices of Takete-Ide" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Voices of Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/85 leading-relaxed">
            Community history, cultural memory, and oral traditions — preserved in the authentic voice of those who carry our heritage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/get-involved" variant="secondary" size="sm">
              Recommend an Elder to Interview
            </ButtonLink>
            <ButtonLink href="/oriki" variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/10">
              Explore Oríkì Directory
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <SectionHeading
          eyebrow="Digital Heritage Archive"
          title={histories.length > 0 ? "Recorded Testimonies & Recollections" : "Help Us Record Takete-Ide’s Voices"}
          align="left"
          className="mx-0"
          description={
            histories.length > 0
              ? "Oral history recordings preserved with the consent of speakers and their families."
              : "No recordings have been published yet. Elders’ memories of migration, faith, festivals and family life are part of the community’s history, and this archive is ready to hold them."
          }
        />

        <div className="mt-8 flex flex-col gap-8">
          {histories.length > 0 ? (
            histories.map((history) => {
              const speakerName = history.speaker || history.interviewee;
              const hasAudio = Boolean(history.audio_url);

              return (
                <article
                  key={history.id}
                  className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-sm"
                >
                  <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-purple-50 shadow-inner">
                      {history.photo_url ? (
                        <Image
                          src={history.photo_url}
                          alt={speakerName}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-purple-600/30">
                          <User className="h-12 w-12" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif text-2xl font-bold text-purple-950">
                            {history.title ?? speakerName}
                          </h2>
                          {history.title && (
                            <span className="text-xs text-charcoal/60">({speakerName})</span>
                          )}
                        </div>
                        <VerificationBadge status={history.verification_status} />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-charcoal/65">
                        {history.interviewer && (
                          <span className="inline-flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                            Recorded by: {history.interviewer}
                          </span>
                        )}
                        {history.interview_date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gold-700" aria-hidden="true" />
                            {formatDate(history.interview_date)}
                          </span>
                        )}
                        {history.recording_location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-purple-700" aria-hidden="true" />
                            {history.recording_location}
                          </span>
                        )}
                        {history.language && (
                          <span className="inline-flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5 text-charcoal/50" aria-hidden="true" />
                            {history.language}
                          </span>
                        )}
                      </div>

                      {history.summary && (
                        <p className="mt-4 text-sm leading-relaxed text-charcoal/80">{history.summary}</p>
                      )}

                      {/* Audio Player */}
                      {hasAudio && (
                        <div className="mt-5">
                          <AudioPlayer
                            src={history.audio_url!}
                            label={`Audio Recording: ${history.title ?? speakerName}`}
                            speaker={speakerName}
                            durationLabel={history.duration}
                          />
                        </div>
                      )}

                      {/* Transcription Status */}
                      <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                          <FileText className="h-4 w-4 text-purple-700" aria-hidden="true" />
                          <span>Transcription &amp; Translation</span>
                        </div>
                        {history.transcript ? (
                          <div className="mt-2.5 space-y-2 text-xs leading-relaxed text-charcoal/85">
                            <p className="font-serif italic">&ldquo;{history.transcript}&rdquo;</p>
                            {history.english_translation && (
                              <p className="border-t border-purple-200/50 pt-2 text-charcoal/70">
                                <strong className="text-charcoal/80">English Translation:</strong> {history.english_translation}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-charcoal/65 italic">
                            Transcription is being prepared in accordance with community archival review standards.
                          </p>
                        )}
                      </div>

                      {/* Topics & Tags */}
                      {history.topics.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-semibold text-charcoal/50 mr-1">Topics:</span>
                          {history.topics.map((t) => (
                            <span
                              key={t}
                              className="rounded-full bg-purple-50 px-2.5 py-0.5 text-2xs font-semibold text-purple-700 ring-1 ring-purple-600/10"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Related & Provenance */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 pt-3 text-xs text-charcoal/60">
                        <div className="flex flex-wrap items-center gap-3">
                          {history.related_family_slug && (
                            <Link
                              href={`/families/${history.related_family_slug}`}
                              className="inline-flex items-center gap-1 font-semibold text-community-green hover:underline"
                            >
                              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Related Family
                            </Link>
                          )}
                          {history.related_person_slug && (
                            <Link
                              href={`/our-people/${history.related_person_slug}`}
                              className="inline-flex items-center gap-1 font-semibold text-community-green hover:underline"
                            >
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Related Person
                            </Link>
                          )}
                        </div>
                        <LastUpdated date={history.last_verified_at} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {contributionRoutes.map((route) => (
                <div key={route.href} className="flex flex-col rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                  <route.icon className="h-6 w-6 text-gold-700" aria-hidden="true" />
                  <h2 className="mt-3 font-serif text-lg font-bold text-purple-950">{route.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/75">{route.description}</p>
                  <ButtonLink href={route.href} variant="outline" size="sm" className="mt-5 self-start">
                    {route.cta}
                  </ButtonLink>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

