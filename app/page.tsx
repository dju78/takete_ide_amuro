import Link from "next/link";
import { getImageProps } from "next/image";
import { HeritageImage } from "@/components/ui/HeritageImage";
import {
  BookOpen,
  Calendar,
  Users,
  Globe2,
  Route,
  GraduationCap,
  HeartPulse,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { IconCard } from "@/components/cards/IconCard";
import { LivingHeritageCard } from "@/components/cards/LivingHeritageCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { WeatherHomeSection } from "@/components/weather/WeatherCard";
import { getLatestNews } from "@/lib/data/news";
import { getGalleryHighlights } from "@/lib/data/gallery";
import { getLatestEvent } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";

const fallbackGallery = [
  { src: "/images/takete-ide/children-traditional-attire.jpg", alt: "Two children in traditional Takete-Ide attire" },
  { src: "/images/takete-ide/cultural-procession.jpg", alt: "Children in a cultural procession at a Takete-Ide celebration" },
  { src: "/images/takete-ide/takete-ide-day.jpg", alt: "Community members preparing for a Takete-Ide Day celebration" },
  { src: "/images/takete-ide/takete-ide-day-2025.jpg", alt: "News coverage of Takete-Ide Day 2025" },
  { src: "/images/takete-ide/ate-egungun.jpg", alt: "Ate, one of the Egungun traditions of Takete-Ide" },
  { src: "/images/takete-ide/marriage-celebration-1.jpg", alt: "Ceremonial items associated with a marriage celebration" },
  { src: "/images/takete-ide/marriage-celebration-2.jpg", alt: "A marriage celebration gathering in Takete-Ide" },
];

const heroImageSrc = "/images/takete-ide/children-traditional-attire.jpg";
const heroImageAlt = "Two children in traditional Takete-Ide attire, wearing beaded necklaces and matching caps";

export default async function HomePage() {
  const [news, gallery, latestEvent] = await Promise.all([
    getLatestNews(3),
    getGalleryHighlights(8),
    getLatestEvent(),
  ]);

  // The hero renders two <Image> instances (mobile + desktop compositions) of the
  // same source file. next/image's `priority` prop always injects a <link rel="preload">
  // regardless of CSS display, so marking both priority would preload — and fetch —
  // both variants on every load. Instead, the two <Image>s stay non-priority (lazy;
  // display:none instances never intersect, so they never fetch) and we manually
  // preload only the variant matching the current viewport via a media-scoped <link>,
  // using the same `lg` (1024px) breakpoint as the mobile/desktop markup split.
  const { props: mobileHeroImg } = getImageProps({ src: heroImageSrc, alt: heroImageAlt, fill: true, sizes: "100vw" });
  const { props: desktopHeroImg } = getImageProps({ src: heroImageSrc, alt: heroImageAlt, fill: true, sizes: "55vw" });

  return (
    <>
      <link rel="preload" as="image" imageSrcSet={mobileHeroImg.srcSet} imageSizes="100vw" media="(max-width: 1023px)" fetchPriority="high" />
      <link rel="preload" as="image" imageSrcSet={desktopHeroImg.srcSet} imageSizes="55vw" media="(min-width: 1024px)" fetchPriority="high" />

      {/* Hero — deliberately two different compositions, not one squeezed into the other.
          Mobile: stacked text -> buttons -> contained image, generous breathing room.
          Desktop (lg+): cinematic edge-to-edge side-by-side, unchanged from before. */}
      <section className="relative overflow-hidden bg-purple-700">
        {/* Mobile / tablet composition */}
        <div className="px-5 pb-12 pt-12 text-white lg:hidden">
          <h1 className="font-serif text-[2.25rem] font-bold leading-[1.1]">Takete-Ide Amuro</h1>
          <p className="mt-3 text-xl font-semibold text-gold-300">Heritage &bull; Unity &bull; Progress</p>
          <p className="mt-4 text-base leading-relaxed text-white/85">
            A historic community in Mopamuro Local Government Area, Kogi State, Nigeria.
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <ButtonLink href="/our-story" size="lg" className="w-full justify-center">
              Explore Our History
            </ButtonLink>
            <ButtonLink href="/takete-ide-day" variant="secondary" size="lg" className="w-full justify-center">
              Takete-Ide Day
            </ButtonLink>
          </div>
          <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
            {/* Not `priority` — see the manual media-scoped <link rel="preload"> above.
                Default lazy loading also means the display:none instance (on lg+
                viewports) never fetches at all. */}
            <HeritageImage
              src={heroImageSrc}
              alt={heroImageAlt}
              label="Children in Traditional Attire, Takete-Ide Amuro"
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Desktop composition */}
        <div className="mx-auto hidden min-h-[650px] w-full max-w-7xl lg:grid lg:grid-cols-[45%_55%] lg:items-stretch">
          <div className="relative z-10 flex flex-col justify-center px-8 text-white">
            <h1 className="font-serif text-5xl font-bold leading-tight lg:text-6xl">Takete-Ide Amuro</h1>
            <p className="mt-3 text-2xl font-semibold text-gold-300">Heritage &bull; Unity &bull; Progress</p>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
              A historic community in Mopamuro Local Government Area, Kogi State, Nigeria.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/our-story" size="lg">
                Explore Our History
              </ButtonLink>
              <ButtonLink href="/takete-ide-day" variant="secondary" size="lg">
                Takete-Ide Day
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            {/* Not `priority` — see the manual media-scoped <link rel="preload"> above. */}
            <HeritageImage
              src={heroImageSrc}
              alt={heroImageAlt}
              label="Children in Traditional Attire, Takete-Ide Amuro"
              fill
              sizes="55vw"
              className="object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-purple-700 via-purple-700/50 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-gold-500 via-community-green to-gold-500" />
      </section>

      {/* Welcome */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <SectionHeading
              eyebrow="Welcome"
              title="Welcome to Our Community"
              align="left"
              description="Takete-Ide Amuro is a proud community in Mopamuro Local Government Area of Kogi State, Nigeria. Across generations, its people have preserved a rich cultural heritage while promoting education, faith, enterprise, unity and community-led development."
              className="mx-0"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <IconCard icon={BookOpen} title="Rich Heritage" description="Centuries of culture and tradition." tone="purple" />
              <IconCard icon={Calendar} title="Annual Festival" description="Takete-Ide Day brings us together." tone="gold" />
              <IconCard icon={Users} title="Community Development" description="Self-help projects for sustainable growth." tone="green" />
              <IconCard icon={Globe2} title="Diaspora Connection" description="Uniting indigenes across the world." tone="purple" />
            </div>
          </div>
        </Container>
      </section>

      {/* Living Heritage — the visual centrepiece of the homepage */}
      <section className="bg-white py-20">
        <Container>
          <SectionHeading
            eyebrow="Culture in Motion"
            title="Living Heritage of Takete-Ide"
            description="Authentic moments from our traditions — captured, preserved and shared."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
            <LivingHeritageCard
              href="/heritage/traditional-marriage"
              title="Traditional Marriage"
              description="Ceremonial items and gatherings associated with marriage celebrations."
              image="/images/takete-ide/marriage-celebration-1.jpg"
              imageAlt="Ceremonial items associated with a marriage celebration in Takete-Ide"
            />
            <LivingHeritageCard
              href="/gallery"
              title="Passing Heritage Forward"
              description="Children of Takete-Ide carrying our traditions into the next generation."
              image="/images/takete-ide/cultural-procession.jpg"
              imageAlt="Children in a cultural procession at a Takete-Ide celebration"
            />
          </div>
        </Container>
      </section>

      {/* Takete-Ide Day */}
      <section className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          {/* Mobile: one strong photograph, text below, historical years as a simple link list */}
          <div className="lg:hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
              <HeritageImage
                src="/images/takete-ide/takete-ide-day.jpg"
                alt="Community members preparing for a Takete-Ide Day celebration"
                label="Takete-Ide Day"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="mt-8">
              <SectionHeading
                eyebrow="Our Signature Event"
                title="Takete-Ide Day"
                align="left"
                tone="light"
                description="A vibrant annual festival that celebrates our culture, strengthens unity, and drives community development."
                className="mx-0"
              />
              <ButtonLink href="/takete-ide-day" className="mt-6 w-full justify-center sm:w-auto">
                Learn More About the Festival
              </ButtonLink>
              {latestEvent && (
                <p className="mt-4 text-sm text-white/70">
                  Most recent celebration on record: Takete-Ide Day {latestEvent.year}
                  {latestEvent.event_date && ` — ${formatDate(latestEvent.event_date)}`}.
                </p>
              )}
              <Link href="/takete-ide-day/2025" className="mt-3 inline-block text-sm font-semibold text-gold-300 hover:underline">
                See the 2025 Celebration →
              </Link>
            </div>
          </div>

          {/* Desktop: side-by-side text + two-photo grid, unchanged */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
            <div>
              <SectionHeading
                eyebrow="Our Signature Event"
                title="Takete-Ide Day"
                align="left"
                tone="light"
                description="A vibrant annual festival that celebrates our culture, strengthens unity, and drives community development."
                className="mx-0"
              />
              <ButtonLink href="/takete-ide-day" className="mt-6">
                Learn More About the Festival
              </ButtonLink>
              {latestEvent && (
                <p className="mt-4 text-sm text-white/70">
                  Most recent celebration on record: Takete-Ide Day {latestEvent.year}
                  {latestEvent.event_date && ` — ${formatDate(latestEvent.event_date)}`}.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <HeritageImage
                  src="/images/takete-ide/takete-ide-day.jpg"
                  alt="Community members preparing for a Takete-Ide Day celebration"
                  label="Takete-Ide Day"
                  fill
                  sizes="22vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <HeritageImage
                  src="/images/takete-ide/takete-ide-day-2025.jpg"
                  alt="News coverage: Kogi celebrates Takete-Ide Day 2025"
                  label="Takete-Ide Day 2025"
                  fill
                  sizes="22vw"
                  className="object-cover"
                />
                <Link
                  href="/takete-ide-day/2025"
                  className="absolute bottom-2 left-2 rounded-full bg-purple-900/80 px-3 py-1 text-xs font-semibold"
                >
                  2025 Celebration
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Building the Future */}
      <section className="bg-ivory py-20">
        <Container>
          <SectionHeading eyebrow="Development" title="Building the Future" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <IconCard icon={Route} title="Roads & Access" description="Improving access roads and bridges that connect Takete-Ide with neighbouring communities." href="/development" />
            <IconCard icon={GraduationCap} title="Education" description="Supporting schools and learning initiatives to empower our children." href="/development" tone="gold" />
            <IconCard icon={HeartPulse} title="Healthcare" description="Advancing primary healthcare through community-driven efforts." href="/development" tone="green" />
            <IconCard icon={Building2} title="Community Infrastructure" description="Civic centres and facilities built through community self-help." href="/development" />
          </div>
        </Container>
      </section>

      {/* Latest News — kept deliberately compact while empty; expands once real articles exist */}
      <section className="bg-white py-12">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading eyebrow="Newsroom" title="Latest News" align="left" className="mx-0" />
            {news.length > 0 && (
              <ButtonLink href="/news" variant="outline" size="sm">
                View All News
              </ButtonLink>
            )}
          </div>
          <div className="mt-6">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal/60">
                Community news and announcements will appear here once published.{" "}
                <Link href="/news" className="font-semibold text-community-green hover:underline">
                  Visit the newsroom →
                </Link>
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Gallery strip — mobile leads with one large featured photo rather than a wall of thumbnails */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Gallery" title="Moments from Takete-Ide" />
          {(() => {
            const items = gallery.length > 0 ? gallery.map((g) => ({ src: g.image_url, alt: g.alt_text })) : fallbackGallery;
            const [featured, ...rest] = items;
            return (
              <>
                <div className="mt-10 lg:hidden">
                  {featured && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lg">
                      <HeritageImage src={featured.src} alt={featured.alt} fill sizes="100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {rest.slice(0, 4).map((img, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-2xl">
                        <HeritageImage src={img.src} alt={img.alt} fill sizes="50vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 hidden grid-cols-3 gap-3 lg:grid lg:grid-cols-4">
                  {items.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                      <HeritageImage src={img.src} alt={img.alt} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          <div className="mt-8 text-center">
            <ButtonLink href="/gallery" variant="secondary" className="w-full justify-center sm:w-auto">
              View Gallery
            </ButtonLink>
          </div>
        </Container>
      </section>

      <WeatherHomeSection />

      {/* Diaspora */}
      <section className="bg-community-green bg-green-600 py-20 text-white">
        <Container className="text-center">
          <SectionHeading
            title="Takete-Ide Around the World"
            tone="light"
            description="Our community extends beyond its geographic boundaries. Takete-Ide people in Nigeria and abroad are part of one family — connect with the wider community network."
          />
          <ButtonLink href="/diaspora" className="mt-8">
            Join the Community Network
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
