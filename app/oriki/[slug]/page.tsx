import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VerificationBadge } from "@/components/ui/Badge";
import { AudioPlayer } from "@/components/heritage/AudioPlayer";
import { getOrikiBySlug } from "@/lib/data/families";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const oriki = await getOrikiBySlug(slug);
  if (!oriki) return { title: "Oríkì not found" };
  return { title: oriki.title, description: oriki.cultural_notes ?? undefined };
}

export default async function OrikiDetailPage({ params }: Props) {
  const { slug } = await params;
  const oriki = await getOrikiBySlug(slug);
  if (!oriki) notFound();

  const audio = oriki.media.find((m) => m.media_type === "audio");
  const video = oriki.media.find((m) => m.media_type === "video");

  return (
    <div className="bg-ivory">
      <Container className="max-w-3xl py-16">
        <Breadcrumb items={[{ label: "Oríkì", href: "/oriki" }, { label: oriki.title }]} />

        <div className="mt-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-purple-600 sm:text-4xl">{oriki.title}</h1>
          {oriki.family && <p className="mt-1 text-charcoal/60">{oriki.family.name} family{oriki.compound && ` · ${oriki.compound.name}`}</p>}
          <div className="mt-3 flex justify-center">
            <VerificationBadge status={oriki.verification_status} />
          </div>
        </div>

        {audio && (
          <div className="mt-8 rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6">
            <AudioPlayer src={audio.url} label="Listen to the Oríkì" />
          </div>
        )}

        <section className="prose-heritage mx-auto mt-10 text-center">
          <h2>Original Recitation</h2>
          <p className="whitespace-pre-line font-serif text-lg italic text-charcoal">{oriki.original_text}</p>
        </section>

        {oriki.transliteration && (
          <section className="prose-heritage mt-10">
            <h2>Transliteration</h2>
            <p className="whitespace-pre-line">{oriki.transliteration}</p>
          </section>
        )}

        {oriki.english_interpretation && (
          <section className="prose-heritage mt-10">
            <h2>Meaning & Interpretation</h2>
            <p className="whitespace-pre-line">{oriki.english_interpretation}</p>
          </section>
        )}

        {oriki.cultural_notes && (
          <section className="prose-heritage mt-10">
            <h2>Cultural Context</h2>
            <p>{oriki.cultural_notes}</p>
          </section>
        )}

        {video && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-bold text-purple-600">Watch the Recitation</h2>
            <video controls preload="none" className="mt-3 w-full rounded-2xl">
              <source src={video.url} />
            </video>
            {video.transcript && <p className="mt-2 text-sm text-charcoal/60">Transcript available on request.</p>}
          </section>
        )}

        {oriki.performer && (
          <section className="mt-10 text-sm text-charcoal/70">
            <strong>Recorded by / Performer:</strong> {oriki.performer}
          </section>
        )}

        {/* Said plainly, and without implying a recording exists: media is withheld
            unless the performer or family confirmed consent for it to be archived. */}
        {!audio && !video && (
          <p className="mt-10 rounded-2xl bg-purple-50 px-5 py-4 text-sm leading-relaxed text-charcoal/70">
            Recordings are published only where the performer or family has confirmed their consent. Where
            no recording appears here, none has been cleared for publication.
          </p>
        )}

        {oriki.family && (
          <section className="mt-6 text-sm text-charcoal/70">
            <Link href={`/families/${oriki.family.slug}`} className="font-semibold text-purple-600 underline underline-offset-2">
              About the {oriki.family.name} family →
            </Link>
          </section>
        )}
      </Container>
    </div>
  );
}
