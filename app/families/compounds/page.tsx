import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationBadge } from "@/components/ui/Badge";
import { getCompounds } from "@/lib/data/families";

export const metadata: Metadata = {
  title: "Compounds",
  description: "The traditional compounds of Takete-Ide Amuro.",
};

export default async function CompoundsPage() {
  const compounds = await getCompounds();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Families & Oríkì", href: "/families" }, { label: "Compounds" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Compounds of Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/80">The traditional compounds that form our community.</p>
        </Container>
      </div>

      <Container className="py-16">
        {compounds.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {compounds.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm">
                {c.photo_url && (
                  <div className="relative aspect-[16/10]">
                    <Image src={c.photo_url} alt={c.name} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="font-serif text-lg font-bold text-purple-600">{c.name}</p>
                  {c.alternative_name && <p className="text-xs text-charcoal/50">Also known as {c.alternative_name}</p>}
                  {c.description && <p className="mt-2 text-sm text-charcoal/70">{c.description}</p>}
                  {c.approximate_location && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-charcoal/50">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {c.approximate_location}
                    </p>
                  )}
                  <VerificationBadge status={c.verification_status} className="mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Compound records are being compiled"
            message="Takete-Ide's traditional compounds will be documented here as information is confirmed with community elders and family representatives."
          />
        )}
      </Container>
    </div>
  );
}
