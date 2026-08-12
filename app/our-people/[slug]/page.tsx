import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { User, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VerificationBadge } from "@/components/ui/Badge";
import { getPersonBySlug } from "@/lib/data/people";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) return { title: "Profile not found" };
  return { title: person.name, description: person.biography?.slice(0, 160) };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = await getPersonBySlug(slug);
  if (!person) notFound();

  return (
    <div className="bg-ivory">
      <Container className="py-16">
        <Breadcrumb items={[{ label: "Our People", href: "/our-people" }, { label: person.name }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-purple-50">
              {person.photo_url ? (
                <Image src={person.photo_url} alt={person.name} fill sizes="280px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-purple-600/30">
                  <User className="h-16 w-16" aria-hidden="true" />
                </div>
              )}
            </div>
            <VerificationBadge status={person.verification_status} className="mt-4" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-purple-600 sm:text-4xl">{person.name}</h1>
            {person.biography && <p className="prose-heritage mt-6 text-charcoal/85">{person.biography}</p>}
            {person.achievements && (
              <div className="mt-6">
                <h2 className="font-serif text-xl font-bold text-purple-600">Achievements</h2>
                <p className="mt-2 text-charcoal/80">{person.achievements}</p>
              </div>
            )}
            {person.external_links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {person.external_links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-semibold text-community-green hover:underline"
                  >
                    {link.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
