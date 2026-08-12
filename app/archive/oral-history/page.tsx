import type { Metadata } from "next";
import Image from "next/image";
import { Mic2, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationBadge } from "@/components/ui/Badge";
import { AudioPlayer } from "@/components/heritage/AudioPlayer";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { getOralHistories } from "@/lib/data/archive";

export const metadata: Metadata = {
  title: "Voices of Takete-Ide",
  description: "Oral history recordings preserving the memory and testimony of Takete-Ide Amuro's elders and community members.",
};

export default async function OralHistoryPage() {
  const histories = await getOralHistories();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Digital Archive", href: "/archive" }, { label: "Voices of Takete-Ide" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Voices of Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Community history, told by those who carry its memory.
          </p>
          <ButtonLink href="/get-involved" variant="primary" size="sm" className="mt-6">
            Recommend an Elder to Interview
          </ButtonLink>
        </Container>
      </div>

      <Container className="py-16">
        <SectionHeading eyebrow="Oral History" title="Recorded Testimony" align="left" className="mx-0" />
        <div className="mt-8 flex flex-col gap-8">
          {histories.length > 0 ? (
            histories.map((history) => (
              <article key={history.id} className="grid gap-6 rounded-2xl border border-purple-600/10 bg-white p-6 sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-purple-50">
                  {history.photo_url ? (
                    <Image src={history.photo_url} alt={history.interviewee} fill sizes="140px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-purple-600/30">
                      <User className="h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-serif text-xl font-bold text-purple-600">{history.interviewee}</h2>
                    <VerificationBadge status={history.verification_status} />
                  </div>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {history.interviewer && `Interviewed by ${history.interviewer}`}
                    {history.interview_date && ` · ${formatDate(history.interview_date)}`}
                  </p>
                  {history.summary && <p className="mt-3 text-sm text-charcoal/80">{history.summary}</p>}
                  {history.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {history.topics.map((t) => (
                        <span key={t} className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-600">{t}</span>
                      ))}
                    </div>
                  )}
                  {history.audio_url && <div className="mt-4"><AudioPlayer src={history.audio_url} label="Listen to the interview" /></div>}
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              icon={Mic2}
              title="Oral history recordings are being collected"
              message="Interviews with community elders and knowledge-holders will be published here as they are recorded, transcribed and reviewed with proper consent."
            />
          )}
        </div>
      </Container>
    </div>
  );
}
