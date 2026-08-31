import type { Metadata } from "next";
import Link from "next/link";
import { Info, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getCommunityMedia } from "@/lib/data/community-media";
import { EVENTS } from "@/lib/media/community-media";

export const metadata: Metadata = {
  title: "Takete-Ide Cultural Attire",
  description:
    "The community's striped cultural cloth — how it is worn, a detail of the material, and how to enquire about availability.",
};

export default async function CentenaryAttirePage() {
  const items = await getCommunityMedia({ event: EVENTS.centenaryAttire });
  const lead = items.find((m) => m.id === "centenary-attire-group");
  const supporting = items.filter((m) => m.id !== "centenary-attire-group");
  const caveats = items.filter((m) => m.verificationStatus === "pending-verification" && m.verificationNote);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Takete-Ide Day", href: "/takete-ide-day" }, { label: "Cultural Attire" }]} />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
            Cultural Attire Archive
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
            Takete-Ide Day Cultural Attire — 2025
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            The community&rsquo;s striped cultural cloth, photographed as it was worn. The attire held in
            the archive carries Takete-Ide Day 2025 branding.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* The lead is a portrait phone photograph. Cropping it to a wide banner
            cuts the clothes out of a page about the clothes, so it keeps its own
            shape and the copy sits alongside it. */}
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {lead && (
            <figure>
              <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl shadow-lg">
                <HeritageImage
                  src={lead.src}
                  alt={lead.altText}
                  label="Official Takete-Ide attire"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mx-auto mt-3 max-w-md text-sm text-charcoal/60">
                {lead.description}
              </figcaption>
            </figure>
          )}

          <div>
            <div className="prose-heritage">
              <h2 className="mt-0">The cloth</h2>
              <p>
                The attire is cut from a striped community cloth — a deep navy ground crossed by
                red, white and pale blue stripes — worn by women and men alike, with matching head-ties and
                caps. Worn together at a gathering, it reads instantly as Takete-Ide: one community, one
                cloth, whatever else anyone is wearing.
              </p>
              <p>
                The photographs on this page are community photographs of the attire in use, supplied to
                the Takete-Ide archive. They show the cloth as it was made and worn rather than as a studio
                product, which is the point — this is dress for a celebration, not a catalogue.
              </p>
            </div>

            <aside className="mt-8 rounded-3xl border border-gold-500/30 bg-gold-100/60 p-6">
              <h2 className="font-serif text-lg font-bold text-purple-600">
                Centenary 2026 Official Attire
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                The official attire for the 2026 Centenary Celebration has not yet been confirmed for
                publication. Information coming soon following official confirmation.
              </p>
              <Link
                href="/centenary"
                className="mt-3 inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline"
              >
                About the Centenary →
              </Link>
            </aside>

            <aside className="mt-6 rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-purple-600">Ordering &amp; availability</h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                Pricing, sizing and how to order the official attire are arranged through the celebration
                organising committee. Those details have not yet been confirmed for publication here, so
                rather than print figures that may be wrong, please get in touch and the committee will
                respond with what is current.
              </p>
              <ButtonLink href="/contact" variant="secondary" size="sm" className="mt-5">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Enquire about the attire
              </ButtonLink>
              <p className="mt-4 text-xs text-charcoal/50">
                Administrators can publish confirmed ordering details on this page from the admin area once
                the committee supplies them.
              </p>
            </aside>
          </div>
        </div>

        {supporting.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Culture &amp; Events"
              title="The attire, close up"
              align="left"
              className="mx-0"
              description="Women's and men's presentations, and a detail of the cloth as supplied."
            />
            <div className="mt-8">
              <MediaGallery items={supporting} variant="grid" columns={3} />
            </div>
          </section>
        )}

        {caveats.length > 0 && (
          <div className="mt-12 flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-5 text-sm text-charcoal/80">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
            <div>
              <p className="font-semibold text-charcoal">Still being confirmed</p>
              {caveats.map((m) => (
                <p key={m.id} className="mt-1 leading-relaxed">
                  {m.verificationNote}
                </p>
              ))}
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-charcoal/50">
          The people photographed here are members of the Takete-Ide community. They are not named on this
          page — see our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
