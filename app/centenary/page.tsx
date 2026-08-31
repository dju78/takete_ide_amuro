import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Info, Globe2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewsCard } from "@/components/cards/NewsCard";
import { CentenaryCountdown } from "@/components/community/CentenaryCountdown";
import { BranchStrip } from "@/components/tipu/BranchStrip";
import { MediaGallery } from "@/components/media/MediaGallery";
import { getCentenary } from "@/lib/data/community-programme";
import { getFeaturedBranches } from "@/lib/data/tipu-branches";
import { getCommunityMedia } from "@/lib/data/community-media";
import { getLatestNews } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "Takete-Ide Day & Centenary Celebration 2026",
  description:
    "Celebrating 100 years of heritage — the Takete-Ide Day and Centenary Celebration on Saturday, 31 October 2026 at the Takete-Ide Primary School Field.",
};

export default async function CentenaryPage() {
  const [centenary, branches, attire, news] = await Promise.all([
    getCentenary(),
    getFeaturedBranches(),
    getCommunityMedia({ category: "Centenary", mediaType: "image" }),
    getLatestNews(3),
  ]);

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="relative overflow-hidden bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb items={[{ label: "Centenary 2026" }]} />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-300">
            {centenary.title}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl">
            {centenary.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{centenary.intro}</p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold-300" aria-hidden="true" />
              {centenary.eventDateLabel}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
              {centenary.venue}
            </span>
          </div>

          <CentenaryCountdown eventDate={centenary.eventDate} tone="light" className="mt-8 max-w-xl" />

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/support">Support the Centenary</ButtonLink>
            <ButtonLink
              href="/takete-ide-day"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-700"
            >
              About Takete-Ide Day
            </ButtonLink>
          </div>
        </Container>
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gold-500 via-community-green to-gold-500" />
      </div>

      <Container className="py-14 sm:py-16">
        {/* What the centenary marks — carefully worded. */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="prose-heritage">
            <h2 className="mt-0">A hundred years, marked together</h2>
            <p>
              Takete-Ide Day is the community&rsquo;s major annual socio-cultural festival, bringing
              together indigenes at home and in the diaspora. In 2026 it is held as a Centenary
              Celebration — a milestone gathering of families, friends and branches at the Takete-Ide
              Primary School Field.
            </p>
            <p>
              The day serves, as it always has, both as a homecoming and as the community&rsquo;s
              principal moment of fundraising for its own development.
            </p>
          </div>

          <aside className="flex gap-3 rounded-2xl border border-gold-500/30 bg-gold-100/60 p-5 text-sm leading-relaxed text-charcoal/80">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
            <div>
              <p className="font-semibold text-charcoal">About the centenary date</p>
              <p className="mt-1">
                The celebration is named by the community as a centenary. Exactly which anniversary it
                marks is not stated in the records available to this archive. Community accounts associate
                the year 1926 with the relocation from the Ilu-Oke hill settlement to the plains — which
                would make this a hundred years of the present town — while other accounts describe events
                well before that. Takete-Ide is not claimed here to have been founded in 1926.{" "}
                <Link href="/our-story" className="font-semibold underline underline-offset-2">
                  Read our history
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>

        {/* Programme — a placeholder, not invented content. */}
        <section className="mt-16">
          <SectionHeading eyebrow="On the day" title="Programme" align="left" className="mx-0" />
          <div className="mt-6">
            <EmptyState
              icon={CalendarDays}
              title="The programme is being finalised"
              message={centenary.programmeStatus}
            />
          </div>
        </section>

        {/* Coming home — connects the branch network to the celebration. */}
        {branches.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Homecoming"
              title="Coming Home From Near and Far"
              align="left"
              className="mx-0"
              description="From branches across Nigeria to Takete-Ide communities in the UK, Europe and North America, the Centenary provides an opportunity to reconnect at home."
            />
            <div className="mt-8">
              <BranchStrip branches={branches.slice(0, 5)} />
            </div>
            <Link
              href="/tipu/branches"
              className="mt-6 inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-community-green hover:underline"
            >
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Explore Our Global Community →
            </Link>
          </section>
        )}

        {/* Attire — the 2026 set is not confirmed, the 2025 archive is. */}
        <section className="mt-16">
          <SectionHeading eyebrow="Cultural dress" title="Centenary Attire" align="left" className="mx-0" />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-xl font-bold text-purple-600">
                Centenary 2026 Official Attire
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{centenary.attireStatus}</p>
              <p className="mt-4 rounded-xl bg-purple-50 px-4 py-3 text-xs font-medium text-purple-600">
                Information coming soon following official confirmation
              </p>
            </div>

            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-serif text-xl font-bold text-purple-600">Cultural Attire Archive</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                The community&rsquo;s striped cultural cloth, photographed in use. The set held in the
                archive carries Takete-Ide Day 2025 branding.
              </p>
              {attire.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {attire.filter((item) => !item.isPlaceholder).slice(0, 3).map((item) => (
                    <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl">
                      <HeritageImage
                        src={item.src}
                        alt={item.altText}
                        label={item.title}
                        fill
                        sizes="(min-width: 1024px) 12vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <Link
                href="/takete-ide-day/cultural-attire"
                className="mt-5 inline-flex min-h-6 items-center text-sm font-semibold text-community-green hover:underline"
              >
                View the attire archive →
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {attire.length > 0 && (
          <section className="mt-16">
            <SectionHeading
              eyebrow="Gallery"
              title="Towards the Centenary"
              align="left"
              className="mx-0"
              description="Photographs from the community archive relating to the celebration."
            />
            <div className="mt-8">
              <MediaGallery items={attire} variant="grid" columns={4} />
            </div>
          </section>
        )}

        {/* Updates */}
        <section className="mt-16">
          <SectionHeading eyebrow="Updates" title="Latest Updates" align="left" className="mx-0" />
          <div className="mt-8">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Centenary updates will appear here"
                message="Announcements from the Central Planning Committee will be published here as they are released."
              />
            )}
          </div>
        </section>

        {/* Support CTA */}
        <div className="mt-16 rounded-3xl bg-purple-700 p-8 text-white shadow-sm lg:p-10">
          <h2 className="font-serif text-2xl font-bold">Support the Centenary</h2>
          <p className="mt-3 max-w-2xl text-white/85">
            Contributions towards the Centenary Celebration and the community&rsquo;s development are made
            through the Takete-Ide Progressive Union&rsquo;s official account.
          </p>
          <ButtonLink href="/support" className="mt-6">
            View the official account
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
