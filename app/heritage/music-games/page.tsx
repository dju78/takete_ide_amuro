import type { Metadata } from "next";
import { Music2, Gamepad2, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import {
  BOOK_ADDITIONAL_RELIGIOUS_TRADITIONS,
  BOOK_CHILDHOOD_GAMES,
  BOOK_MUSIC_TRADITIONS,
  BOOK_TRADITIONAL_INSTRUMENTS,
} from "@/content/history/web/from-hilltops-to-valley-expanded";


export const metadata: Metadata = {
  title: "Music, Games & Everyday Heritage",
  description:
    "Traditional music groups, instruments, childhood games and cultural practices of Takete-Ide.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/music-games`,
  },
};

export default function MusicGamesPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Music, Games & Everyday Heritage" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Music2 className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Everyday cultural memory</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Music, Games &amp; Everyday Heritage</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                Community life in Takete-Ide is richly defined by indigenous music, festive dance, folk games, storytelling, and ceremonial performances.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-14 sm:py-16">
        <div>
          <SourcedSection
            title="Music and entertainment in community memory"
          >
            <p>
              Traditional musical ensembles and instruments form a central part of cultural ceremonies,
              rehearsals and community celebrations across Takete-Ide, preserving enduring heritage for future generations.
            </p>
          </SourcedSection>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {BOOK_MUSIC_TRADITIONS.map((item) => (
            <article key={item.name} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
              <Music2 className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <h2 className="mt-3 font-serif text-xl font-bold text-purple-950">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-purple-950">Traditional instruments recorded</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {BOOK_TRADITIONAL_INSTRUMENTS.map((instrument) => (
              <span key={instrument} className="rounded-full bg-gold-100 px-4 py-2 text-sm font-semibold text-gold-900">
                {instrument}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
            The manuscript names these instruments without providing a full organological description of each.
            The website therefore preserves their names without inventing construction or playing details.
          </p>
        </section>

        <section className="mt-12">
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-5 w-5 text-community-green" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Childhood games and recreation</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            Some activities are translated in the manuscript; others are preserved only by name. Where the source
            does not explain a game, this page does not guess at its rules.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOOK_CHILDHOOD_GAMES.map((game) => (
              <article key={game.name} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-purple-950">{game.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{game.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold-700" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold text-purple-950">Older religious and masquerade traditions</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
            These traditions are presented as historical and community-memory records. The descriptions do not
            imply that every practice remains active today.
          </p>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {BOOK_ADDITIONAL_RELIGIOUS_TRADITIONS.map((item) => (
              <article key={item.name} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-purple-950">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/80">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
