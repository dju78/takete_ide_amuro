import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  Church,
  GraduationCap,
  Users2,
  FileText,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { MigrationTimeline } from "@/components/history/MigrationTimeline";
import { MIGRATION_TIMELINE } from "@/content/history/web/migration-timeline";

export const metadata: Metadata = {
  title: "Our Story | Takete-Ide Amuro",
  description:
    "Explore the community historical account of Takete-Ide — from earlier settlements and upland migrations to the present settlement around 1926.",
};

const toc = [
  { label: "A Place of Comfort", id: "a-place-of-comfort" },
  { label: "Takete within Amuro", id: "takete-within-amuro" },
  { label: "Earlier Roots", id: "earlier-roots" },
  { label: "The Search for Peace", id: "the-search-for-peace" },
  { label: "Migration Journey", id: "journey" },
  { label: "Home at Last (c.1926)", id: "home-at-last" },
  { label: "Faith & Development", id: "faith-and-development" },
  { label: "Community Memory", id: "community-memory" },
];

export default function OurStoryPage() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <div className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "Our Story" }]} />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            OUR STORY
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            From the Hills to a Home of Peace
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            The story of Takete-Ide reaches beyond the present settlement. Community historical accounts
            preserve a journey through earlier settlements, periods of migration and the eventual
            movement from the uplands to the present site around 1926.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="#journey" size="lg">
              Explore the Journey
            </ButtonLink>
            <ButtonLink
              href="/archive"
              variant="secondary"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Explore the Digital Archive
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[240px_1fr]">
        {/* Sticky Desktop Table of Contents */}
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28 text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wider text-charcoal/50">On this page</p>
            <ul className="space-y-2 border-l-2 border-purple-600/15 pl-4">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="block py-1 text-charcoal/70 transition-colors hover:text-purple-600 focus-visible:text-purple-600 font-medium"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-purple-600/10 bg-purple-50/50 p-4 text-xs leading-relaxed text-charcoal/70">
              <p className="font-semibold text-purple-900">Historical Sources</p>
              <p className="mt-1">
                Based on preserved community historical accounts, oral traditions, and administrative records.
              </p>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col gap-14">
          <ResearchDisclaimer />

          {/* Section 1: A Place of Comfort */}
          <section id="a-place-of-comfort">
            <SourcedSection
              title="Takete-Idera — A Place of Comfort"
              status="community_tradition"
              sourceNote="Preserved in the supplied community historical account. The etymology is understood within community tradition."
            >
              <p>
                In the everyday speech of its people, the town is known as <strong>Takete-Ide</strong>.
                According to the supplied community historical account, the full traditional name is{" "}
                <em>Takete-Idera</em>, which carries the meaningful sense of being{" "}
                <strong>&ldquo;separated to a place of comfort, rest and peace.&rdquo;</strong>
              </p>
              <p>
                The name reflects a hard-won journey. Today, Takete-Ide sits on a fertile, level plain
                surrounded by a protective cascade of hills and uplands—including{" "}
                <Link href="/gallery?category=Nature" className="text-community-green underline underline-offset-2">
                  Obasoro Hill
                </Link>
                , Oke Elegan, and Oroke Agodi.
              </p>
              <p>
                The territory is naturally blessed with rich water bodies: visitors from the western axis
                cross the <strong>Owowo River</strong>, those from the eastern axis cross the{" "}
                <strong>Eba River (Omi Ebba)</strong>, and southern approaches meet the <strong>Oga</strong>,
                alongside local streams such as Ibedo, Igan, Igboruku, also popularly called Gboruku, Pandara, and Omi Loke.
              </p>
            </SourcedSection>
          </section>

          {/* Section 2: Takete within Amuro */}
          <section id="takete-within-amuro">
            <SourcedSection
              title="Takete within Amuro"
              status="community_tradition"
              sourceNote="Administrative and traditional context according to the supplied community historical account."
            >
              <p>
                The supplied community historical account describes Takete-Ide as the second largest of the
                seven historic towns and villages that comprise the <strong>Amuro District</strong> in the
                MopAmuro Local Government Area of Kogi State. The seven Amuro settlements are:
              </p>
              <ul className="grid grid-cols-2 gap-2 font-medium text-purple-900 sm:grid-cols-3">
                <li>• Takete-Ide</li>
                <li>• Orokere</li>
                <li>• Aiyede</li>
                <li>• Okagi</li>
                <li>• Aiyedayo / Iloke</li>
                <li>• Otafun</li>
                <li className="col-span-2 sm:col-span-1">• Aiyeteju Agbajogun</li>
              </ul>
              <p>
                Takete-Ide occupies a central geographical position in the district, sharing direct
                boundaries with Otafun to the east, Ayedayo to the south, and Ayede to the west. The
                supplied account notes that this centrality contributed to the establishment of an Area
                Office of the MopAmuro Local Government in Takete-Ide following the creation of the council in 1991.
              </p>
              <p>
                Traditional leadership is vested in the{" "}
                <Link href="/heritage/traditional-institution" className="text-community-green underline underline-offset-2">
                  Olu’de of Takete-Ide
                </Link>{" "}
                and the Takete-Ide Traditional Council, while community affairs at the district level
                relate to the paramount stool of the Alamuro of Amuro.
              </p>
            </SourcedSection>
          </section>

          {/* Section 3: Earlier Roots */}
          <section id="earlier-roots">
            <SourcedSection
              title="Earlier Roots & Yagba Ancestry"
              status="oral_history"
              sourceNote="Oral traditions preserved in secondary community narratives. Multiple ancestral accounts exist across Okun sub-groups."
            >
              <p>
                The people of Amuro belong to the <strong>Iyagba (Yagba)</strong> branch of the{" "}
                <strong>Okun Yoruba</strong> people of the Confluence region. The Okun identity unites
                related sub-groups—including Iyagba, Owe, Bunu, Ijumu, Gbede, Kiri, and Oworo—who share
                striking linguistic, cultural, and historical affinities and the time-honoured salutation of{" "}
                <em>&ldquo;Okun&rdquo;</em> (signifying strength, vitality, and goodwill).
              </p>
              <p>
                Oral traditions handed down over generations preserve complementary migration accounts:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <h4 className="font-serif font-bold text-purple-900">The Ile-Ife Tradition</h4>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                    One widely cherished tradition associates the patriarchal ancestor with an expedition from
                    Ile-Ife, where a late return and lost territory prompted the reflective phrase{" "}
                    <em>&ldquo;Iya agba lo jemi&rdquo;</em> (&ldquo;lack of an elder to counsel me&rdquo;),
                    from which the name Iyagba was derived.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <h4 className="font-serif font-bold text-purple-900">The Old-Oyo Tradition</h4>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                    A second tradition links the name to an esteemed princess from Oyo-Ile (<em>Iya-agba</em>,
                    meaning an elder woman) who led a migration in search of peace and established settlements
                    in Yagba West.
                  </p>
                </div>
              </div>
              <p className="text-xs text-charcoal/60">
                Both traditions emphasize migration, resilience, and deep Yoruba lineage. Historically, power
                resided primarily in clans, compounds, and councils of elders rather than a single centralised
                monarchy.
              </p>
            </SourcedSection>
          </section>

          {/* Section 4: The Search for Peace */}
          <section id="the-search-for-peace">
            <SourcedSection
              title="The Search for Peace & Regional Conflicts"
              status="community_tradition"
              sourceNote="Historical account preserved in the supplied community manuscript."
            >
              <p>
                During the eighteenth and nineteenth centuries, communities across the Niger-Benue
                confluence basin experienced profound upheaval caused by regional conflicts, including
                expansionist campaigns and raids by cavalry forces.
              </p>
              <p>
                Open plain settlements were especially vulnerable to mounted raiders. Faced with relentless
                pressures on their security and livelihood, the forebears of Takete-Ide and neighbouring
                communities took strategic decisions to disperse into rugged, heavily forested uplands that
                naturally neutralized cavalry incursions.
              </p>
              <p>
                This era tested the endurance of the people. It fostered deep traditional solidarity,
                protective vigilance, and a resolute search for an enduring, secure sanctuary.
              </p>
            </SourcedSection>
          </section>

          {/* Section 5: Migration Journey (Visual Timeline) */}
          <section id="journey" className="pt-2">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
              <SectionHeading
                eyebrow="Historical Journey"
                title="From Earlier Settlements to the Plains"
                align="left"
                className="mx-0"
                description="Community historical accounts record sequential stages of settlement as our forebears navigated regional challenges in search of peace."
              />

              <div className="mt-12">
                <MigrationTimeline entries={MIGRATION_TIMELINE} />
              </div>
            </div>
          </section>

          {/* Section 6: Home at Last (c.1926) */}
          <section id="home-at-last">
            <SourcedSection
              title="Home at Last — The Present Settlement"
              status="community_tradition"
              sourceNote="Movement to the present site took place in 1926 or thereabouts according to community records."
            >
              {/* Critical Centenary Callout */}
              <div className="rounded-2xl border-2 border-gold-500/40 bg-gold-100/60 p-6 sm:p-8">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-6 w-6 shrink-0 text-gold-700" aria-hidden="true" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-purple-950 sm:text-2xl">
                      1926 marks a new chapter in the story — not the beginning of Takete-Ide.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/85">
                      The supplied community historical account places the movement from the upland hill
                      settlement of Ilu-Oke to the present low plain in <strong>1926 or thereabouts</strong>.
                      The 2026 Centenary celebrates approximately a century of peace, unity, and growth at
                      this present site, while honouring a much older heritage reaching well beyond the present settlement.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6">
                Oral tradition remembers <strong>Pa Thomas Ode</strong>, a hunter, as an early figure in the
                story of the present settlement. According to oral tradition, consultations among hunters and
                community elders confirmed that the fertile low plain offered lasting peace, water, and
                agricultural abundance.
              </p>
              <p>
                In an orderly descent, the main quarters of the community—<strong>Odo Takete</strong>,{" "}
                <strong>Oke Adan</strong>, and <strong>Oke Ako</strong> (following a brief stop at
                Aiyetoro)—relocated down to the plains. Initially called <em>Ileteju</em> (&ldquo;flat
                land&rdquo;), the settlers soon affirmed the name <strong>Takete-Idera</strong> to signify
                their enduring arrival in a home of comfort and tranquility.
              </p>
              <p>
                Community historical memory identifies <strong>Pa George Fiki</strong> as the first child born at
                the present settlement. For nearly a century since, the community historical account remembers
                the period as one of sustained brotherhood and relative communal stability.
              </p>
            </SourcedSection>
          </section>

          {/* Section 7: Faith & Development */}
          <section id="faith-and-development">
            <SourcedSection
              title="Faith, Civic Self-Help & Community Progress"
              status="community_tradition"
              sourceNote="SIM Christianity introduced c.1919 per community historical record; 1939 Bell; 1975 School resolution."
            >
              <p>
                In the twentieth century, Takete-Ide embraced faith, education, and civic self-help as
                twin pillars of community development:
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <Church className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  <h4 className="mt-3 font-serif font-bold text-purple-900">Christian Faith (c.1919)</h4>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                    SIM Christianity was introduced according to the community historical record around 1919, followed
                    by the establishment of First Baptist Church in 1922 and the arrival of the church bell in May 1939.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <GraduationCap className="h-6 w-6 text-community-green" aria-hidden="true" />
                  <h4 className="mt-3 font-serif font-bold text-purple-900">Education (1975)</h4>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                    On 26 December 1975, the community resolved to establish its own secondary school,
                    empowering generations of scholars and professionals.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <Users2 className="h-6 w-6 text-gold-700" aria-hidden="true" />
                  <h4 className="mt-3 font-serif font-bold text-purple-900">TIPU Civic Union</h4>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                    The Takete-Ide Progressive Union unites branches across Nigeria and the diaspora to build
                    roads, security, and civic infrastructure.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/heritage/faith"
                  className="inline-flex items-center text-sm font-semibold text-purple-700 hover:underline"
                >
                  Explore the full Faith &amp; Religious Heritage archive →
                </Link>
              </div>
            </SourcedSection>
          </section>

          {/* Section 8: Community Memory & Archive Link */}
          <section id="community-memory">
            <div className="rounded-3xl bg-purple-700 p-8 text-white shadow-sm sm:p-10">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                    Sources & Documentation
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                    Historical Sources &amp; Community Memory
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                    This account draws on preserved community historical narratives and oral traditions.
                    Some names, dates and interpretations remain subject to continuing documentation and
                    verification by community elders and historians.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink href="/archive" size="lg">
                    Explore the Digital Archive
                  </ButtonLink>
                  <ButtonLink
                    href="/heritage"
                    variant="secondary"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Culture &amp; Heritage
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
