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
  ShieldCheck,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { IconCard } from "@/components/cards/IconCard";
import { LivingHeritageCard } from "@/components/cards/LivingHeritageCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { WeatherHomeSection } from "@/components/weather/WeatherCard";
import { CentenaryCountdown } from "@/components/community/CentenaryCountdown";
import { HomeBranchShowcase } from "@/components/tipu/HomeBranchShowcase";
import { getLatestNews } from "@/lib/data/news";
import { getHomepageGallery, getHomepagePlaceMedia } from "@/lib/data/gallery";
import { getFeaturedBranches } from "@/lib/data/tipu-branches";
import { getCentenary, getSupportAccount } from "@/lib/data/community-programme";
import { getPublishedEvents } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";

const fallbackGallery = [
  { src: "/images/takete-ide/children-traditional-attire.jpg", alt: "Two children in traditional Takete-Ide attire" },
  { src: "/images/takete-ide/cultural-procession.jpg", alt: "Children in a cultural procession at a Takete-Ide celebration" },
  { src: "/images/takete-ide/takete-ide-day.jpg", alt: "Community members preparing for a Takete-Ide Day celebration" },
  { src: "/images/takete-ide/takete-ide-day-2025.jpg", alt: "News coverage of Takete-Ide Day 2025" },
  { src: "/images/takete-ide/ate-egungun.jpg", alt: "Ate, one of the Egungun traditions of Takete-Ide" },
  { src: "/images/takete-ide/marriage-celebration-1.jpg", alt: "Ceremonial items associated with a marriage celebration" },
];

/**
 * Closes the homepage strip on an existing community photograph. Deliberately
 * one that appears nowhere else on this page — every other archive image is
 * already spoken for by the hero, the place section, Culture & Heritage or the
 * branch showcase.
 */
const homepagePeoplePhoto = {
  src: "/images/takete-ide/marriage-celebration-2.jpg",
  alt: "A marriage celebration gathering in Takete-Ide",
};

/** Short label under each place photograph, keyed by its media id. */
const placeCaptions: Record<string, string> = {
  "obasoro-hill": "Natural heritage",
  "eba-river-bank": "Omi Ebba",
  "first-baptist-church": "Built heritage",
};

/** Where each place photograph sends you in the gallery. */
const placeLinks: Record<string, string> = {
  "obasoro-hill": "/gallery?category=Nature",
  "eba-river-bank": "/gallery?category=Nature",
  "first-baptist-church": "/gallery?category=Places+of+Worship",
};

const heroImageSrc = "/images/takete-ide/children-traditional-attire.jpg";
const heroImageAlt = "Two children in traditional Takete-Ide attire, wearing beaded necklaces and matching caps";

export default async function HomePage() {
  const [news, gallery, place, branches, centenary, account, events] = await Promise.all([
    getLatestNews(3),
    getHomepageGallery(),
    getHomepagePlaceMedia(),
    getFeaturedBranches(),
    getCentenary(),
    getSupportAccount(),
    getPublishedEvents(),
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
          Desktop (lg+): cinematic edge-to-edge side-by-side. */}
      <section className="relative overflow-hidden bg-purple-700">
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
            <ButtonLink href="/centenary" variant="secondary" size="lg" className="w-full justify-center">
              Centenary 2026
            </ButtonLink>
          </div>
          <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl">
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
              <ButtonLink href="/centenary" variant="secondary" size="lg">
                Centenary 2026
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
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

      {/* Centenary — the community's biggest upcoming date, so it sits directly
          under the hero rather than being buried further down. */}
      <section className="bg-purple-900 py-10 text-white sm:py-12">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                {centenary.title}
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">{centenary.headline}</h2>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {centenary.eventDateLabel}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-300" aria-hidden="true" />
                  {centenary.venue}
                </span>
              </div>
              <ButtonLink href="/centenary" size="sm" className="mt-5">
                Centenary 2026
              </ButtonLink>
            </div>
            <CentenaryCountdown eventDate={centenary.eventDate} tone="light" className="lg:max-w-md" />
          </div>
        </Container>
      </section>

      {/* Welcome */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <SectionHeading
              eyebrow="Welcome"
              title="Welcome to Takete-Ide"
              align="left"
              description="Takete-Ide Amuro is a proud community in Mopamuro Local Government Area of Kogi State, Nigeria. Across generations, its people have preserved a rich cultural heritage while promoting education, faith, enterprise, unity and community-led development."
              className="mx-0"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <IconCard icon={BookOpen} title="Rich Heritage" description="Centuries of culture and tradition." tone="purple" href="/heritage" />
              <IconCard icon={Calendar} title="Annual Festival" description="Takete-Ide Day brings us together." tone="gold" href="/takete-ide-day" />
              <IconCard icon={Users} title="Community Development" description="Self-help projects for sustainable growth." tone="green" href="/development" />
              <IconCard icon={Globe2} title="Diaspora Connection" description="Uniting indigenes across the world." tone="purple" href="/diaspora" />
            </div>
          </div>
        </Container>
      </section>

      {/* Our Place — the land itself. Takete-Ide is a somewhere before it is
          anything else. Data-driven so an editor unfeaturing a photograph
          removes it here too. */}
      {place.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Our Place"
              title="The Land We Come From"
              description="Hills, river and landmarks that have shaped Takete-Ide life for generations."
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              {place.map((item, i) => (
                <Link
                  key={item.id}
                  href={placeLinks[item.id] ?? "/gallery"}
                  className={
                    i === 0
                      ? "group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-sm lg:aspect-auto lg:row-span-2 lg:min-h-[24rem]"
                      : "group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-sm lg:aspect-auto lg:min-h-[11.25rem]"
                  }
                >
                  <HeritageImage
                    src={item.src}
                    alt={item.altText}
                    label={item.title}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 sm:p-6">
                    <span
                      className={
                        i === 0
                          ? "block font-serif text-2xl font-bold text-white"
                          : "block font-serif text-xl font-bold text-white"
                      }
                    >
                      {item.title}
                    </span>
                    {placeCaptions[item.id] && (
                      <span className="mt-0.5 block text-sm text-white/80">{placeCaptions[item.id]}</span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Building Our Community — development */}
      <section className="bg-ivory py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Development"
            title="Building Our Community"
            description="Community-led projects, tracked openly from proposal through completion."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <IconCard icon={Route} title="Roads & Infrastructure" description="Improving access roads and bridges that connect Takete-Ide with neighbouring communities." href="/development" />
            <IconCard icon={ShieldCheck} title="Security" description="The community Security Trust Fund, raised across the union's branches." href="/development/security-trust-fund" tone="gold" />
            <IconCard icon={GraduationCap} title="Education" description="Supporting schools and learning initiatives to empower our children." href="/education" tone="green" />
            <IconCard icon={HeartPulse} title="Healthcare" description="Advancing primary healthcare through community-driven efforts." href="/development" />
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/development" variant="outline" size="sm">
              All development projects
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Culture & Heritage */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Culture in Motion"
            title="Culture & Heritage"
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
          <div className="mt-8 text-center">
            <ButtonLink href="/heritage" variant="outline" size="sm">
              Explore culture &amp; heritage
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* One Takete-Ide. Many Locations. */}
      {branches.length > 0 && (
        <section className="bg-ivory py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="The TIPU Network"
              title="One Takete-Ide. Many Locations."
              description="From Takete-Ide to communities across Nigeria, the United Kingdom, Europe and North America, our people remain connected by heritage, family and a shared commitment to development."
            />
            <div className="mt-10">
              <HomeBranchShowcase branches={branches} />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/tipu/branches" variant="secondary" size="sm">
                Explore the TIPU Network →
              </ButtonLink>
              <ButtonLink href="/diaspora" variant="outline" size="sm">
                Join the diaspora network
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {/* Our Community in Pictures */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Gallery"
            title="Our Community in Pictures"
            description="A few frames from the wider community archive."
          />
          {(() => {
            const items =
              gallery.length > 0
                ? [...gallery.map((g) => ({ src: g.image_url, alt: g.alt_text })), homepagePeoplePhoto]
                : fallbackGallery;
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

                <div className="mt-10 hidden gap-3 lg:grid lg:grid-cols-3">
                  {items.map((img, i) => (
                    <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                      <HeritageImage src={img.src} alt={img.alt} fill sizes="33vw" className="object-cover" />
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

      {/* Latest News */}
      <section className="bg-ivory py-12 sm:py-16">
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

      {/* Upcoming Events — the Centenary always, plus any published event records. */}
      <section className="bg-white py-12 sm:py-16">
        <Container>
          <SectionHeading eyebrow="What's next" title="Upcoming Events" align="left" className="mx-0" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/centenary"
              className="group rounded-2xl border border-purple-600/10 bg-ivory p-6 shadow-sm transition-shadow hover:shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                {centenary.eventDateLabel}
              </p>
              <h3 className="mt-2 font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">
                {centenary.title}
              </h3>
              <p className="mt-2 text-sm text-charcoal/70">{centenary.venue}</p>
            </Link>
            {events.slice(0, 2).map((event) => (
              <Link
                key={event.id}
                href={`/takete-ide-day/${event.year}`}
                className="group rounded-2xl border border-purple-600/10 bg-ivory p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">
                  {event.event_date ? formatDate(event.event_date) : `Takete-Ide Day ${event.year}`}
                </p>
                <h3 className="mt-2 font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">
                  Takete-Ide Day {event.year}
                </h3>
                {event.theme && <p className="mt-2 text-sm text-charcoal/70">{event.theme}</p>}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <WeatherHomeSection />

      {/* Support Takete-Ide */}
      <section className="bg-community-green bg-green-600 py-16 text-white sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="Support"
                title="Support Takete-Ide"
                tone="light"
                align="left"
                className="mx-0"
                description="Support approved community, heritage and development initiatives through the Takete-Ide Progressive Union."
              />
              <ButtonLink href="/support" className="mt-8">
                View the official account
              </ButtonLink>
            </div>
            {account && (
              <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-inset ring-white/15 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
                  Official contribution account
                </p>
                <p className="mt-2 font-serif text-lg font-bold">{account.accountName}</p>
                <p className="mt-1 text-sm text-white/80">{account.bankName}</p>
                <p className="mt-3 font-serif text-2xl font-bold tracking-wider tabular-nums text-gold-300">
                  {account.accountNumber}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
