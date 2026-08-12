import type { Metadata } from "next";
import Link from "next/link";
import { Music4 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getOrikiList } from "@/lib/data/families";

export const metadata: Metadata = {
  title: "Oríkì of Takete-Ide",
  description: "Preserving the praise poetry, ancestral expressions and oral traditions of Takete-Ide families.",
};

export default async function OrikiPage() {
  const orikiList = await getOrikiList();

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-center text-white">
        <Container>
          <Breadcrumb items={[{ label: "Oríkì" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Oríkì of Takete-Ide</h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Preserving the praise poetry, ancestral expressions and oral traditions through which
            generations of Takete-Ide families have remembered identity, character and heritage.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        {orikiList.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orikiList.map((o) => (
              <Link
                key={o.id}
                href={`/oriki/${o.slug}`}
                className="rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <p className="font-serif text-lg font-bold text-purple-600">{o.title}</p>
                {o.family && <p className="text-sm text-charcoal/60">{o.family.name} family</p>}
                <p className="mt-3 line-clamp-3 text-sm italic text-charcoal/70">{o.original_text}</p>
                <VerificationBadge status={o.verification_status} className="mt-3" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Music4}
            title="The Oríkì archive is just beginning"
            message="No Oríkì have been published yet. Original wording is never generated or altered — every entry here will come directly from families, elders and recognised community sources."
          >
            <ButtonLink href="/oriki/contribute" size="sm" className="mt-4">
              Contribute an Oríkì
            </ButtonLink>
          </EmptyState>
        )}
      </Container>
    </div>
  );
}
