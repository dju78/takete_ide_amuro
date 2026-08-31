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
    "Takete-Ide Day and Centenary Celebration 2026 — commemorating approximately a century at the present settlement while honouring a much older community history.",
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
        {/* Why 2026 Matters — A Century at the Present Settlement */}
        <section className="mt-4 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-800">
                Why 2026 Matters
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
                A Century at the Present Settlement
              </h2>
              <p className="mt-3 text-base leading-relaxed text-charcoal/80">
                The historical account preserved by the community places the movement from the upland
                settlements to the present Takete-Ide site at <strong>around 1926</strong>. The 2026
                Centenary therefore looks back on approximately a century at the present settlement while
                recognising that Takete-Ide&rsquo;s history reaches much further back.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Centenary 2026 celebrates a hundred years of peace, unity, and agricultural flourishing on the
                plains—honouring the endurance of forebears who journeyed from earlier settlements to build the
                vibrant community of today.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-community-green hover:underline"
                >
                  Explore the full migration journey in Our Story →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <Info className="mt-1 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-base font-bold text-purple-950">Historical Note</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    The 1926 milestone commemorates approximately a century at the present low-plain site
                    following the descent from the historic upland settlement of Ilu-Oke. Takete-Ide is
                    not claimed here to have been founded in 1926.
                  </p>
                  <p className="mt-2 text-xs italic text-charcoal/60">
                    Historical interpretation based on the supplied community account and subject to
                    continuing community documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
