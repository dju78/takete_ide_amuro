import type { Metadata } from "next";
import Link from "next/link";
import { Crown, Landmark, Mic2, Image as ImageIcon, Music4, Sparkles, Shirt, Church, Mountain, Users2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconCard } from "@/components/cards/IconCard";
import { LivingHeritageCard } from "@/components/cards/LivingHeritageCard";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { getCommunityMedia } from "@/lib/data/community-media";

export const metadata: Metadata = {
  title: "Culture & Heritage",
  description:
    "The festivals, dress, places of worship, landscape and community life that shape Takete-Ide's identity.",
};

export default async function HeritagePage() {
  const [worship, nature, landmarks, newYam] = await Promise.all([
    getCommunityMedia({ category: "Places of Worship", mediaType: "image" }),
    getCommunityMedia({ category: "Nature", mediaType: "image" }),
    getCommunityMedia({ category: "Landmarks", mediaType: "image" }),
    getCommunityMedia({ category: "Culture & Events", mediaType: "image" }),
  ]);
  const newYamLead = newYam.find((m) => m.id === "new-yam-ilorin-full-group");
  const okutaGbooro = landmarks.find((m) => m.id === "okuta-gbooro" || m.id === "okuta-gboro");
  const landscapeMedia = [
    ...(okutaGbooro ? [okutaGbooro] : []),
    ...nature.filter((m) => m.id !== "okuta-gbooro" && m.id !== "okuta-gboro"),
  ].slice(0, 4);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Culture & Heritage" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Culture &amp; Heritage</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            The traditions, customs and living culture that shape Takete-Ide&rsquo;s identity — festivals,
            dress, faith, land and the everyday life of the community.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <ResearchDisclaimer />

        {/* Festivals — the calendar the community keeps. */}
        <SectionHeading eyebrow="Culture in Motion" title="Our Festivals" align="left" className="mx-0 mt-14" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <LivingHeritageCard
            href="/takete-ide-day"
            title="Takete-Ide Day"
            description="The annual homecoming festival, held in 2026 as the Centenary Celebration."
            image="/images/takete-ide/takete-ide-day.jpg"
            imageAlt="Community members preparing for a Takete-Ide Day celebration"
          />
          <LivingHeritageCard
            href="/tipu/branches/ilorin"
            title="New Yam Festival"
            description="The TIPU Ilorin Branch New Yam celebration, held on Saturday 22 August 2026."
            image="/images/takete-ide/new-yam-festival/full-group.jpg"
            imageAlt="TIPU Ilorin Branch members in matching celebration cloth at the New Yam Festival"
          />
          <LivingHeritageCard
            href="/heritage/agado"
            title="Agado Festival"
            description="Community video footage from the Agado Festival."
            isVideo
          />
          <LivingHeritageCard
            href="/heritage/ate"
            title="Ate — Egungun Heritage"
            description="Ate, one of the Egungun traditions observed in Takete-Ide."
            image="/images/takete-ide/ate-egungun.jpg"
            imageAlt="Ate, one of the Egungun traditions of Takete-Ide, in full masquerade dress"
          />
        </div>

        {/* More Cultural Traditions — Ogun Festival */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
              <HeritageImage
                src="/images/takete-ide/heritage/ogun-festival.png"
                alt="A cultural gathering of community members associated with the Ogun Festival in Takete-Ide"
                label="Ogun Festival"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">Cultural Tradition</span>
              <h3 className="font-serif text-base font-bold text-purple-950">Ogun Festival</h3>
              <p className="text-xs text-charcoal/75">
                A community cultural gathering associated with the Ogun Festival tradition in Takete-Ide.
              </p>
            </div>
          </div>
          <Link
            href="/gallery?category=Culture+%26+Events"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/50 px-3.5 py-1.5 text-xs font-semibold text-purple-900 hover:bg-purple-100"
          >
            Explore Cultural Gallery →
          </Link>
        </div>

        {/* New Yam feature — the best-documented festival in the archive. */}
        {newYamLead && (
          <section className="mt-16 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm lg:grid lg:grid-cols-2 lg:items-stretch">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
              <HeritageImage
                src={newYamLead.src}
                alt={newYamLead.altText}
                label="TIPU Ilorin Branch New Yam Festival"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">
                Saturday, 22 August 2026
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
                New Yam Festival — TIPU Ilorin Branch
              </h2>
              <p className="mt-4 leading-relaxed text-charcoal/80">
                Members gathered in a shared celebration cloth for a day of culture, fellowship and the
                recognition of service to the union — one of the clearest expressions of Takete-Ide identity
                away from home.
              </p>
              <Link
                href="/tipu/branches/ilorin"
                className="mt-6 inline-flex min-h-6 items-center self-start text-sm font-semibold text-community-green hover:underline"
              >
                See the photographs and video →
              </Link>
            </div>
          </section>
        )}

        {/* Cultural attire */}
        <section className="mt-16">
          <SectionHeading eyebrow="What we wear" title="Cultural Attire" align="left" className="mx-0" />
          <div className="mt-8 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm lg:grid lg:grid-cols-[1fr_1.2fr]">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[18rem]">
              <HeritageImage
                src="/images/takete-ide/centenary-attire/attire-group.jpg"
                alt="Community members wearing the striped Takete-Ide cultural attire"
                label="Takete-Ide cultural attire"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="flex flex-col justify-center p-8">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-700">
                <Shirt className="h-4 w-4" aria-hidden="true" />
                Community cloth
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-purple-600 sm:text-2xl">
                One community, one cloth
              </h3>
              <p className="mt-3 leading-relaxed text-charcoal/80">
                A deep navy ground crossed by red, white and pale blue stripes, worn by women and men alike
                with matching head-ties and caps. Worn together at a gathering, it reads instantly as
                Takete-Ide.
              </p>
              <Link
                href="/takete-ide-day/cultural-attire"
                className="mt-5 inline-flex min-h-6 items-center self-start text-sm font-semibold text-community-green hover:underline"
              >
                View the attire archive →
              </Link>
            </div>
          </div>
        </section>

        {/* Places of worship + landscape, side by side. */}
        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Faith" title="Faith &amp; Religious Heritage" align="left" className="mx-0" />
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Faith has been part of Takete-Ide’s cultural and community life across generations. From indigenous
              religious traditions to the arrival and growth of Christianity, the community’s religious heritage preserves
              an important part of its historical journey.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {worship.slice(0, 4).map((item) => (
                <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <HeritageImage
                    src={item.src}
                    alt={item.altText}
                    label={item.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Link
                href="/heritage/faith"
                className="inline-flex min-h-6 items-center text-sm font-semibold text-purple-700 hover:underline"
              >
                Explore Faith &amp; Religious Heritage →
              </Link>
              <Link
                href="/gallery?category=Places+of+Worship"
                className="inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline"
              >
                Places of Worship Gallery →
              </Link>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="The Land"
              title="Land, Water &amp; Memory"
              align="left"
              className="mx-0"
            />
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              The natural landscape of Takete-Ide is shaped by historic hills, life-giving rivers, and ancestral settlements preserved in community memory.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {landscapeMedia.map((item) => (
                <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <HeritageImage
                    src={item.src}
                    alt={item.altText}
                    label={item.title}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-charcoal/70">
              <span><strong>Hills:</strong> Obasoro, Oke Elegan, Oroke Agodi</span>
              <span>•</span>
              <span><strong>Waters:</strong> Eba, Owowo, Oga, Ibedo, Igan, Igboruku / Gboruku</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <Link
                href="/gallery?category=Nature"
                className="inline-flex items-center text-community-green hover:underline"
              >
                Nature &amp; waterways →
              </Link>
              <Link
                href="/gallery?category=Landmarks"
                className="inline-flex items-center text-gold-700 hover:underline"
              >
                Community landmarks →
              </Link>
            </div>
          </div>
        </section>

        {/* Explore the rest of the heritage estate. */}
        <SectionHeading eyebrow="Explore" title="More of Our Heritage" align="left" className="mx-0 mt-16" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <IconCard
            icon={Crown}
            title="Traditional Institution"
            description="The Olude of Takete-Ide Amuro, the traditional council and their responsibilities."
            href="/heritage/traditional-institution"
          />
          <IconCard
            icon={Landmark}
            title="Our Families"
            description="The families and compounds that form the Takete-Ide community."
            href="/families"
            tone="gold"
          />
          <IconCard
            icon={Music4}
            title="Our Oríkì"
            description="Praise poetry and oral traditions passed down through generations."
            href="/oriki"
            tone="green"
          />
          <IconCard
            icon={Mic2}
            title="Voices of Takete-Ide"
            description="Community history from those who carry its memory."
            href="/archive/oral-history"
          />
          <IconCard
            icon={Sparkles}
            title="Traditional Marriage"
            description="Ceremonial items and gatherings associated with marriage celebrations."
            href="/heritage/traditional-marriage"
            tone="gold"
          />
          <IconCard
            icon={ImageIcon}
            title="Community Life"
            description="Everyday moments and celebrations from across the community."
            href="/gallery"
            tone="green"
          />
          <IconCard
            icon={Sparkles}
            title="Agbagba Ide"
            description="Sacred sanctuary, cultural memory and symbol of community resilience."
            href="/heritage/agbagba-ide"
            tone="purple"
          />
          <IconCard
            icon={Music4}
            title="Community Anthem"
            description="The preserved Takete-Ide Anthem and Oríkì Agbagba Ide in original Yoruba."
            href="/heritage/takete-ide-anthem"
            tone="gold"
          />
          <IconCard
            icon={Church}
            title="Faith & Religious Heritage"
            description="From indigenous spiritual heritage to the churches and places of worship in Takete-Ide."
            href="/heritage/faith"
            tone="purple"
          />
          <IconCard
            icon={Landmark}
            title="Our History"
            description="Origins, settlement, faith and the making of the community."
            href="/our-story"
          />
          <IconCard
            icon={Mountain}
            title="Landmarks"
            description="Obasoro Hill, Okuta Gbooro and the places that mark our land."
            href="/gallery?category=Landmarks"
            tone="gold"
          />
          <IconCard
            icon={Users2}
            title="Education"
            description="How the community built its own schooling, in its own words."
            href="/education"
            tone="green"
          />
        </div>
      </Container>
    </div>
  );
}
