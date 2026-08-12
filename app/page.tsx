import Link from "next/link";
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

export default async function HomePage() {
  const [news, gallery, latestEvent] = await Promise.all([
    getLatestNews(3),
    getGalleryHighlights(8),
    getLatestEvent(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-purple-700 lg:min-h-[650px]">
        <div className="mx-auto grid min-h-[560px] w-full max-w-7xl lg:min-h-[650px] lg:grid-cols-[45%_55%] lg:items-stretch">
          <div className="relative z-10 flex flex-col justify-center px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-0">
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Takete-Ide Amuro</h1>
            <p className="mt-3 text-xl font-semibold text-gold-300 sm:text-2xl">Heritage &bull; Unity &bull; Progress</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
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
          <div className="relative min-h-[360px] lg:min-h-0">
            <HeritageImage
              src="/images/takete-ide/children-traditional-attire.jpg"
              alt="Two children in traditional Takete-Ide attire, wearing beaded necklaces and matching caps"
              label="Children in Traditional Attire, Takete-Ide Amuro"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-purple-700 via-purple-700/50 to-transparent lg:w-1/4" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-r from-gold-500 via-community-green to-gold-500" />
      </section>

      {/* Welcome */}
      <section className="bg-ivory py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <SectionHeading
              eyebrow="Welcome"
              title="Welcome to Our Community"
              align="left"
              description="Takete-Ide Amuro is a proud community in Mopamuro Local Government Area of Kogi State, Nigeria. Across generations, its people have preserved a rich cultural heritage while promoting education, faith, enterprise, unity and community-led development."
              className="mx-0"
            />
            <div className="grid gap-4 sm:grid-cols-2">
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
      <section className="bg-purple-700 py-20 text-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
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
                  sizes="(min-width: 1024px) 22vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <HeritageImage
                  src="/images/takete-ide/takete-ide-day-2025.jpg"
                  alt="News coverage: Kogi celebrates Takete-Ide Day 2025"
                  label="Takete-Ide Day 2025"
                  fill
                  sizes="(min-width: 1024px) 22vw, 50vw"
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

      {/* Gallery strip */}
      <section className="bg-ivory py-20">
        <Container>
          <SectionHeading eyebrow="Gallery" title="Moments from Takete-Ide" />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(gallery.length > 0
              ? gallery.map((g) => ({ src: g.image_url, alt: g.alt_text }))
              : fallbackGallery
            ).map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                <HeritageImage src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/gallery" variant="secondary">
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
