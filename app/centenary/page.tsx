import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, MapPin, Info, Globe2, Sparkles, Clock, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { NewsCard } from "@/components/cards/NewsCard";
import { CentenaryCountdown } from "@/components/community/CentenaryCountdown";
import { BranchStrip } from "@/components/tipu/BranchStrip";
import { MediaGallery } from "@/components/media/MediaGallery";
import { CentenaryNav } from "@/components/centenary/CentenaryNav";
import { CentenaryProgrammeSection } from "@/components/centenary/CentenaryProgrammeSection";
import { CentenaryHighlightsSection } from "@/components/centenary/CentenaryHighlightsSection";
import { CentenaryGuestsSection } from "@/components/centenary/CentenaryGuestsSection";
import { CentenaryInvitationSection } from "@/components/centenary/CentenaryInvitationSection";
import { CentenaryRSVPSection } from "@/components/centenary/CentenaryRSVPSection";
import { getCentenary, getCentenaryProgramme, getCentenaryHighlights } from "@/lib/data/community-programme";
import { getCentenaryGuestGroups, getCentenaryRSVP } from "@/lib/data/centenary-guests";
import { getFeaturedBranches } from "@/lib/data/tipu-branches";
import { getCommunityMedia } from "@/lib/data/community-media";
import { getLatestNews } from "@/lib/data/news";

export const metadata: Metadata = {
  title: "Takete-Ide Day & Centenary Celebration 2026",
  description:
    "Official Takete-Ide Centenary 2026 Celebration (29–31 October 2026) — programme schedule, official invitation, dignitaries, guests & hosts, event highlights, venue and RSVP information.",
};

export default async function CentenaryPage() {
  const [centenary, programmes, guestGroups, rsvpContacts, branches, attire, news] = await Promise.all([
    getCentenary(),
    getCentenaryProgramme(),
    getCentenaryGuestGroups(),
    getCentenaryRSVP(),
    getFeaturedBranches(),
    getCommunityMedia({ category: "Centenary", mediaType: "image" }),
    getLatestNews(3),
  ]);

  const highlights = getCentenaryHighlights();

  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="relative overflow-hidden bg-purple-700 py-14 text-white sm:py-16 lg:py-20">
        <Container>
          <Breadcrumb items={[{ label: "Centenary 2026" }]} />
          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {centenary.title}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/15">
              <CalendarDays className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {centenary.eventDates}
            </span>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {centenary.headline}
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {centenary.intro}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-xl bg-gold-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-200 ring-1 ring-inset ring-gold-400/30">
              Theme: {centenary.theme}
            </span>
            {centenary.motto && (
              <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold italic text-gold-300 ring-1 ring-inset ring-white/15">
                {centenary.motto}
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-3 text-sm text-white/90 sm:grid-cols-2 max-w-3xl">
            <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3.5 ring-1 ring-inset ring-white/15">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <span className="block font-semibold text-white">Main Celebration</span>
                <span className="text-white/80">{centenary.eventDateLabel} · {centenary.mainEventTime}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-3.5 ring-1 ring-inset ring-white/15">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
              <div>
                <span className="block font-semibold text-white">Official Venue</span>
                <span className="text-white/80">{centenary.venue}</span>
              </div>
            </div>
          </div>

          {/* Multi-Programme Intelligent Countdown */}
          <div className="mt-10 max-w-2xl">
            <CentenaryCountdown programmes={programmes} tone="light" />
          </div>

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

      <Container className="py-10 sm:py-14">
        {/* Quick In-Page Navigation */}
        <CentenaryNav className="mb-12" />

        {/* Overview Banner */}
        <section id="overview" className="scroll-mt-24 mb-16 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-purple-700 ring-1 ring-inset ring-purple-600/15">
              A Century of Heritage · A Future of Greater Glory
            </span>
            <h2 className="mt-4 font-serif text-2xl font-bold text-purple-600 sm:text-3xl">
              Special Invitation to the 2026 Takete-Ide Day Centenary Celebration
            </h2>
            <p className="mt-4 text-base leading-relaxed text-charcoal/80">
              The Takete-Ide Progressive Union cordially invites sons, daughters, in-laws, friends and well-wishers
              across Nigeria and the global diaspora to the historic <strong>2026 Takete-Ide Day &amp; Centenary Celebration</strong>.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Join us as we celebrate 100 remarkable years of rich heritage, culture, unity and progress. Together,
              let us honour our past, celebrate our present and build a greater future for Takete-Ide.
            </p>
          </div>
        </section>

        {/* Programme Section */}
        <div className="mb-16">
          <CentenaryProgrammeSection programmes={programmes} />
        </div>

        {/* Official Guests & Hosts Section */}
        <div className="mb-16">
          <CentenaryGuestsSection groups={guestGroups} />
        </div>

        {/* Event Highlights Section */}
        <div className="mb-16">
          <CentenaryHighlightsSection highlights={highlights} />
        </div>

        {/* Official Invitation Section */}
        <div className="mb-16">
          <CentenaryInvitationSection />
        </div>

        {/* Why 2026 Matters — A Century at the Present Settlement */}
        <section id="history" className="scroll-mt-24 mb-16 rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
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

        {/* Attire — the 2026 set is not confirmed, the 2025 archive is. */}
        <section id="attire" className="scroll-mt-24 mb-16">
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

        {/* Coming home — connects the branch network to the celebration. */}
        {branches.length > 0 && (
          <section id="diaspora" className="scroll-mt-24 mb-16">
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

        {/* Gallery */}
        {attire.length > 0 && (
          <section id="gallery" className="scroll-mt-24 mb-16">
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

        {/* RSVP & Enquiries */}
        <div className="mb-16">
          <CentenaryRSVPSection contacts={rsvpContacts} />
        </div>

        {/* Updates */}
        <section className="mb-16">
          <SectionHeading eyebrow="Updates" title="Latest Updates" align="left" className="mx-0" />
          <div className="mt-8">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-purple-600/10 bg-white p-8 text-center sm:p-10">
                <p className="font-serif text-lg font-bold text-purple-900">Centenary updates will appear here</p>
                <p className="mt-2 text-sm text-charcoal/70">Announcements from the Central Planning Committee will be published here as they are released.</p>
              </div>
            )}
          </div>
        </section>

        {/* Support CTA */}
        <div id="support" className="scroll-mt-24 rounded-3xl bg-purple-700 p-8 text-white shadow-sm lg:p-10">
          <h2 className="font-serif text-2xl font-bold">Support the Centenary</h2>
          <p className="mt-3 max-w-2xl text-white/85">
            Contributions towards the Centenary Celebration and the community&rsquo;s development are made
            through the Takete-Ide Progressive Union&rsquo;s official account.
          </p>
          <ButtonLink href="/support" className="mt-6">
            View Contribution Details
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
