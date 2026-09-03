import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Zap,
  LineChart,
  Trophy,
  GraduationCap,
  Gift,
  Share2,
  BookOpen,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { KogiQuestGame } from "@/components/kogi-quest/KogiQuestGame";
import { ShareKogiQuest } from "@/components/kogi-quest/ShareKogiQuest";

export const metadata: Metadata = {
  title: "Kogi Quest | Test Your Knowledge of Kogi State",
  description:
    "Play Kogi Quest and test your knowledge of Kogi State’s history, culture, people and landmarks through an exciting interactive challenge.",
  alternates: {
    canonical: "https://takete-ide.org/kogi-quest",
  },
  openGraph: {
    title: "Kogi Quest | Test Your Knowledge of Kogi State",
    description:
      "Play Kogi Quest and test your knowledge of Kogi State’s history, culture, people and landmarks through an exciting interactive challenge.",
    url: "https://takete-ide.org/kogi-quest",
    siteName: "Takete-Ide Amuro",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kogi Quest | Test Your Knowledge of Kogi State",
    description:
      "Play Kogi Quest and test your knowledge of Kogi State’s history, culture, people and landmarks through an exciting interactive challenge.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kogi Quest",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  url: "https://takete-ide.org/kogi-quest",
  description:
    "Play Kogi Quest and test your knowledge of Kogi State’s history, culture, people and landmarks through an exciting interactive challenge.",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "NGN",
  },
  publisher: {
    "@type": "Organization",
    name: "Omoyele EduVerse",
  },
};

const highlights = [
  {
    icon: Layers,
    title: "Multiple Knowledge Levels",
    description: "Progress from foundational heritage questions to advanced historical deep dives.",
  },
  {
    icon: Zap,
    title: "Instant Answer Feedback",
    description: "Learn as you play with immediate educational insights and fact explanations.",
  },
  {
    icon: LineChart,
    title: "Score Tracking",
    description: "Track your accuracy and watch your score accumulate with every round.",
  },
  {
    icon: Trophy,
    title: "Global Leaderboard",
    description: "Compete against friends, family, and Confluence scholars across the globe.",
  },
  {
    icon: GraduationCap,
    title: "Educational & Entertaining",
    description: "Designed to inspire curiosity about Kogi State’s rich cultural tapestry.",
  },
  {
    icon: Gift,
    title: "Free to Play",
    description: "Open and freely accessible to students, community indigenes, and visitors alike.",
  },
];

export default function KogiQuestPage() {
  return (
    <div className="bg-ivory">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-b from-purple-800 to-purple-700 py-12 text-white sm:py-16">
        <Container>
          <Breadcrumb items={[{ label: "Explore", href: "/heritage" }, { label: "Kogi Quest" }]} />

          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-300 ring-1 ring-inset ring-gold-400/30">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              Interactive Cultural &amp; Educational Experience
            </span>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Kogi Quest: How Well Do You Know the Confluence State?
            </h1>

            <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
              Explore the history, culture, people and remarkable places of Kogi State through an exciting interactive challenge. Answer questions, progress through different levels, build your score and discover how much you truly know about the Confluence State.
            </p>

            <p className="mt-3 font-serif text-lg font-bold text-gold-300 sm:text-xl">
              Do you have what it takes to become a Legend of the Confluence?
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        {/* Interactive Game Player Section */}
        <section id="game-player" aria-label="Play Kogi Quest Interactive Challenge" className="scroll-mt-8">
          <KogiQuestGame />
        </section>

        {/* Engagement Highlights Grid */}
        <section className="mt-16 sm:mt-20">
          <SectionHeading
            eyebrow="Game Features"
            title="Why Play Kogi Quest?"
            description="A modern educational quest built to celebrate and explore the people, landscapes, history and traditions of Kogi State."
          />

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition-all hover:border-purple-600/20 hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-purple-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Challenge Friends & Sharing Section */}
        <section
          id="challenge-friends"
          className="mt-16 scroll-mt-10 rounded-3xl border border-gold-500/20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 p-8 text-white shadow-lg sm:p-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-300">
                <Share2 className="h-4 w-4 text-gold-300" aria-hidden="true" />
                Challenge Your Friends
              </div>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                Ready to See Who Tops the Confluence Leaderboard?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                Share Kogi Quest with classmates, friends, family and diaspora groups. See who can achieve a perfect score and earn the title of Legend of the Confluence!
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end justify-center">
              <ShareKogiQuest />
            </div>
          </div>
        </section>

        {/* Educational Context & Community Connection */}
        <section className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-bold text-purple-600">
              Takete-Ide &amp; The Confluence State
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Takete-Ide Amuro is situated in Mopamuro LGA within the vibrant cultural landscape of Kogi State. Discovering the broader geography and history of the Confluence deepens our appreciation for our own community roots.
            </p>
            <Link
              href="/our-story"
              className="mt-4 inline-flex items-center text-sm font-semibold text-community-green hover:underline"
            >
              Explore Takete-Ide History &rarr;
            </Link>
          </div>

          <div className="rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <BookOpen className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-serif text-xl font-bold text-purple-600">
              Learning Through Play
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
              Games like Kogi Quest turn historical preservation into an interactive journey for young people and lifelong learners across our community at home and in the diaspora.
            </p>
            <Link
              href="/education"
              className="mt-4 inline-flex items-center text-sm font-semibold text-community-green hover:underline"
            >
              Read About Education in Takete-Ide &rarr;
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
