import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VerificationBadge } from "@/components/ui/Badge";
import { AudioPlayer } from "@/components/heritage/AudioPlayer";
import { getFamilyBySlug } from "@/lib/data/families";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const family = await getFamilyBySlug(slug);
  if (!family) return { title: "Family not found" };
  return { title: `${family.name} Family`, description: family.summary ?? undefined };
}

export default async function FamilyPage({ params }: Props) {
  const { slug } = await params;
  const family = await getFamilyBySlug(slug);
  if (!family) notFound();

  const photos = family.media.filter((m) => m.media_type === "photo");

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-center text-white">
        <Container>
          <Breadcrumb items={[{ label: "Families & Oríkì", href: "/families" }, { label: family.name }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">{family.name}</h1>
          <p className="mt-2 text-gold-300">Takete-Ide Amuro Heritage</p>
          {family.compound && <p className="mt-1 text-white/70">{family.compound.name} Compound</p>}
          <div className="mt-4 flex justify-center">
            <VerificationBadge status={family.verification_status} />
          </div>
        </Container>
      </div>

      <Container className="max-w-4xl py-16">
        {photos[0] && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={photos[0].url} alt={photos[0].caption ?? family.name} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}

        {family.summary && (
          <section className="prose-heritage">
            <h2>About the Family</h2>
            <p>{family.summary}</p>
          </section>
        )}

        {family.oriki.length > 0 && (
          <section className="prose-heritage mt-10">
            <h2>Family Oríkì</h2>
            <ul>
              {family.oriki.map((o) => (
                <li key={o.id}>
                  <Link href={`/oriki/${o.slug}`} className="text-purple-600 underline underline-offset-2">
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {family.history && (
          <section className="prose-heritage mt-10">
            <h2>Family History</h2>
            <p>{family.history}</p>
          </section>
        )}

        {family.known_ancestral_accounts && (
          <section className="prose-heritage mt-10">
            <h2>Known Ancestral Accounts</h2>
            <p>{family.known_ancestral_accounts}</p>
            <p className="text-sm italic text-charcoal/60">
              Where community accounts differ, they are presented neutrally pending further documentation.
            </p>
          </section>
        )}

        {family.migration_settlement_history && (
          <section className="prose-heritage mt-10">
            <h2>Migration & Settlement History</h2>
            <p>{family.migration_settlement_history}</p>
          </section>
        )}

        {family.values_and_traditions && (
          <section className="prose-heritage mt-10">
            <h2>Family Values & Traditions</h2>
            <p>{family.values_and_traditions}</p>
          </section>
        )}

        {photos.length > 1 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-bold text-purple-600">Photo Archive</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.slice(1).map((p) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={p.url} alt={p.caption ?? ""} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {family.media
          .filter((m) => m.media_type === "audio")
          .map((m) => (
            <section key={m.id} className="mt-10">
              <AudioPlayer src={m.url} label={m.caption ?? "Family recording"} />
            </section>
          ))}

        {family.notable_contributions && (
          <section className="prose-heritage mt-10">
            <h2>Notable Contributions to Takete-Ide</h2>
            <p>{family.notable_contributions}</p>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-purple-600/10 bg-white p-6 text-sm text-charcoal/70">
          Know more about the {family.name} family? Help complete this record via the{" "}
          <Link href="/families/contribute" className="font-semibold text-purple-600 underline underline-offset-2">
            family contribution form
          </Link>
          .
        </section>
      </Container>
    </div>
  );
}
