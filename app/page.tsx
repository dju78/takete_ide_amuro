import Link from "next/link";
import { HeritageImage } from "@/components/ui/HeritageImage";
import {
  BookOpen,
  Calendar,
  Users,
  Globe2,
  Crown,
  Landmark,
  History,
  Route,
  GraduationCap,
  HeartPulse,
  Building2,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { IconCard } from "@/components/cards/IconCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { WeatherHomeSection } from "@/components/weather/WeatherCard";
import { getLatestNews } from "@/lib/data/news";
import { getGalleryHighlights } from "@/lib/data/gallery";
import { getLatestEvent } from "@/lib/data/events";
import { formatDate } from "@/lib/utils";

const fallbackGallery = [
  { src: "/images/takete-ide/traditional-ceremony.jpg", alt: "Traditional chieftaincy ceremony at Takete-Ide Amuro" },
  { src: "/images/takete-ide/community-life.jpg", alt: "Community members gathered for a Takete-Ide event" },
  { src: "/images/takete-ide/takete-ide-day-2025.jpg", alt: "News coverage of Takete-Ide Day 2025" },
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
          <div className="relative min-h-[320px] lg:min-h-0">
            <HeritageImage
              src="/images/takete-ide/traditional-ceremony.jpg"
              alt="A traditional ceremony at Takete-Ide Amuro, with chiefs in full regalia"
              label="Traditional Ceremony, Takete-Ide Amuro"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[center_20%]"
            />
            {/* Purple-to-transparent wash so the text panel reads as one continuous scene with the photo. */}
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

      {/* Heritage */}
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <HeritageImage
                src="/images/takete-ide/traditional-ceremony.jpg"
                alt="The traditional institution of Takete-Ide Amuro"
                label="Traditional Institution, Takete-Ide Amuro"
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <IconCard
                icon={Crown}
                title="Traditional Institution"
                description="Our community is traditionally led by the Olude of Takete-Ide Amuro, the custodian of our customs, values and heritage."
                href="/heritage/traditional-institution"
              />
              <IconCard
                icon={Landmark}
                title="Cultural Heritage"
                description="From age-long traditions to shared celebrations, our heritage shapes our identity and keeps us united as one people."
                href="/heritage"
                tone="gold"
              />
              <IconCard
                icon={History}
                title="Our History"
                description="Part of the Amuro confederation in Kogi West, with a rich Christian heritage and strong ties to the Yagba people."
                href="/our-story"
                tone="green"
              />
            </div>
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
                <HeritageImage src="/images/takete-ide/takete-ide-day-2024.jpg" alt="Takete-Ide Day 2024 celebration graphic" label="Takete-Ide Day 2024" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <HeritageImage src="/images/takete-ide/takete-ide-day-2025.jpg" alt="News coverage: Kogi celebrates Takete-Ide Day 2025" label="Takete-Ide Day 2025" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
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

      {/* Latest News */}
      <section className="bg-white py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Newsroom" title="Latest News" align="left" className="mx-0" />
            <ButtonLink href="/news" variant="outline" size="sm">
              View All News
            </ButtonLink>
          </div>
          <div className="mt-10">
            {news.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="News is being prepared"
                message="Community news and announcements will appear here once published by the editorial team."
              />
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
