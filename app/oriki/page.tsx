import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Music4, ScrollText, HeartHandshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { OrikiDirectory } from "@/components/oriki/OrikiDirectory";
import { getOrikiRecords } from "@/lib/data/oriki-records";

export const metadata: Metadata = {
  title: "Takete-Ide Family Oríkì | Culture & Heritage",
  description:
    "Explore the consolidated Takete-Ide community family Oríkì records — traditional praise names for men and women celebrating ancestry, identity and heritage.",
};

export const revalidate = 3600;

export default async function OrikiPage() {
  const records = await getOrikiRecords({ publishedOnly: true });

  return (
    <div className="bg-ivory">
      {/* Hero Header */}
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Family Oríkì" },
            ]}
          />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-400/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
            <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
            Ancestral Expressions &amp; Praise Names
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white">
            Takete-Ide Family Oríkì
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            Traditional praise names and ancestral expressions celebrating family lineage, identity and cultural heritage across Takete-Ide Amuro.
          </p>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        {/* Authoritative Cultural Introduction */}
        <section className="mb-12 rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-10 shadow-xs">
          <div className="max-w-4xl space-y-4 text-sm sm:text-base leading-relaxed text-charcoal/85">
            <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl border-b border-purple-100 pb-3">
              Oríkì in Takete-Ide
            </h2>

            <p>
              Oríkì in Takete-Ide, Amuro, are traditional praise names and expressions that celebrate a person’s
              family, ancestry, identity and cultural heritage. They connect individuals to their family roots
              and help preserve the historical relationship between people, their lineages and the wider
              Takete-Ide community.
            </p>

            <p>
              Within the community, families and ancestral groups have distinctive Oríkì by which their members
              may be recognised, honoured and addressed. Some Oríkì differ for men and women, while others apply
              to both. These names are more than ordinary forms of identification. They carry a sense of
              belonging and reflect the place of each family within the cultural life of Takete-Ide.
            </p>

            <p>
              Oríkì may be spoken during greetings, family gatherings, traditional ceremonies, festivals and
              other important community occasions. Their recitation can express affection, respect, encouragement
              and pride. For people living away from Takete-Ide, including members of the community across
              Nigeria and abroad, Oríkì provide an important connection to home and ancestral identity.
            </p>

            <p>
              Preserving these traditional names is essential because much of this knowledge has passed from one
              generation to another through oral tradition. Recording the Oríkì of Takete-Ide families helps
              protect this valuable heritage from being forgotten and makes it accessible to younger generations.
            </p>

            <p className="italic text-charcoal/75 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/60">
              This collection is a developing community record. Elders, family representatives and other
              knowledgeable community members are encouraged to review the entries, correct inaccurate spellings
              and provide any missing Oríkì. Through this shared effort, Takete-Ide can preserve an accurate and
              lasting account of this important aspect of its cultural heritage.
            </p>
          </div>
        </section>

        {/* Directory Section */}
        <section aria-labelledby="directory-heading">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2 id="directory-heading" className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                Consolidated Community Directory
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-charcoal/70">
                Browse official family origins and corresponding male and female praise names.
              </p>
            </div>
          </div>

          <OrikiDirectory records={records} />
        </section>
      </Container>
    </div>
  );
}
