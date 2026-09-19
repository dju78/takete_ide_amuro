import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  Church,
  GraduationCap,
  Users2,
  BookOpen,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { MigrationTimeline } from "@/components/history/MigrationTimeline";
import { MIGRATION_TIMELINE } from "@/content/history/web/migration-timeline";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Story — Heritage, Migrations & Settlement",
  description:
    "Explore the authentic historical journey of Takete-Ide from ancestral settlements to the present site and the 2026 Centenary celebration.",
  alternates: {
    canonical: `${siteConfig.url}/our-story`,
  },
};

export default function OurStoryPage() {
  return (
    <div className="bg-ivory">
      {/* Hero Section */}
      <section className="bg-purple-700 py-16 text-white sm:py-20">
        <Container>
          <Breadcrumb items={[{ label: "Our Story" }]} />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
            Heritage &amp; History
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85 leading-relaxed">
            From ancient hillside redoubts to a peaceful valley home—the enduring journey,
            heritage, and unity of the Takete-Ide community.
          </p>
        </Container>
      </section>

      <Container className="py-14 sm:py-16">
        <div className="space-y-16">
          {/* Section 1: A Place of Comfort */}
          <section id="a-place-of-comfort">
            <SourcedSection
              title="A Place of Comfort in the Plain"
            >
              <p>
                Takete-Ide is geographically situated on an extensive, fertile plain, positioned approximately
                at <strong>Latitude 8° 03′ 50″ N and Longitude 5° 53′ 40″ E</strong>, at an elevation of roughly 418 metres above sea level.
                The landscape is ringed by defensive hills and uplands including{" "}
                <Link href="/heritage/land-and-landscape" className="text-community-green underline underline-offset-2">
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
            >
              <p>
                Takete-Ide is the second largest of the seven historic settlements that comprise the{" "}
                <strong>Amuro District</strong> in the MopAmuro Local Government Area of Kogi State. The
                seven Amuro settlements are:
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
                boundaries with Otafun to the east, Ayedayo to the south, and Ayede to the west. This
                centrality contributed to the establishment of an Area Office of the MopAmuro Local
                Government in Takete-Ide following the creation of the council in 1991.
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
                  <h3 className="font-serif font-bold text-purple-900">The Ile-Ife Tradition</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                    One widely cherished tradition associates the patriarchal ancestor with an expedition from
                    Ile-Ife, where a late return and lost territory prompted the reflective phrase{" "}
                    <em>&ldquo;Iya agba lo jemi&rdquo;</em> (&ldquo;lack of an elder to counsel me&rdquo;),
                    from which the name Iyagba was derived.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <h3 className="font-serif font-bold text-purple-900">The Old-Oyo Tradition</h3>
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
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gold-700">Historical Journey</p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  From Earlier Settlements to the Plains
                </h2>
                <p className="mt-2 text-sm text-charcoal/80">
                  Sequential stages of settlement as our forebears navigated regional challenges in search of peace.
                </p>
              </div>

              <div className="mt-12">
                <MigrationTimeline entries={MIGRATION_TIMELINE} />
              </div>
            </div>
          </section>

          {/* Section 6: Home at Last (c.1926) */}
          <section id="home-at-last">
            <SourcedSection
              title="Home at Last — The Present Settlement"
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
                      Movement from the upland hill settlement of Ilu-Oke to the present low plain took place in{" "}
                      <strong>1926 or thereabouts</strong>. The 2026 Centenary celebrates approximately a century of
                      peace, unity, and growth at this present site, while honouring a much older heritage reaching well
                      beyond the present settlement.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6">
                Oral tradition remembers <strong>Pa Thomas Ode</strong>, a hunter, as an early pioneer in the
                reconnaissance of the present settlement. Deliberations among hunters and community elders confirmed
                that the fertile low plain offered lasting peace, water, and agricultural abundance.
              </p>
              <p>
                In an orderly descent, the main quarters of the community—<strong>Odo Takete</strong>,{" "}
                <strong>Oke Adan</strong>, and <strong>Oke Ako</strong> (following a brief stop at
                Aiyetoro)—relocated down to the plains. Initially called <em>Ileteju</em> (&ldquo;flat
                land&rdquo;), the settlers soon affirmed the name <strong>Takete-Idera</strong> to signify
                their enduring arrival in a home of comfort and tranquility.
              </p>
              <p>
                Historical community memory identifies <strong>Pa George Fiki</strong> as the first child born at
                the present settlement, marking the dawn of a century of sustained peace and communal stability.
              </p>
            </SourcedSection>
          </section>

          {/* Section: Takete-Tedo & Related Communities */}
          <section id="related-communities">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-900">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Related Historical Communities
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-bold text-purple-950">
                    Takete-Tedo / Okegada &amp; Ancestral Migrations
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                    Discover the history of Takete-Tedo (Okegada), the post-1949 migration, family relationships,
                    shared cultural heritage, and the historic bonds connecting both communities across generations.
                  </p>
                </div>
                <Link
                  href="/our-story/takete-tedo"
                  className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-purple-800"
                >
                  Read Takete-Tedo History →
                </Link>
              </div>
            </div>
          </section>

          {/* Section 7: Faith & Development */}
          <section id="faith-and-development">
            <SourcedSection
              title="Faith, Civic Self-Help & Community Progress"
            >
              <p>
                In the twentieth century, Takete-Ide embraced faith, education, and civic self-help as
                twin pillars of community development:
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <Church className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  <h3 className="mt-3 font-serif font-bold text-purple-900">Christian Faith (c.1919)</h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                    SIM Christianity was introduced around 1919, followed by the establishment of First Baptist Church
                    in 1922 and the arrival of the church bell in May 1939.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <GraduationCap className="h-6 w-6 text-community-green" aria-hidden="true" />
                  <h3 className="mt-3 font-serif font-bold text-purple-900">Education (1975)</h3>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal/75">
                    On 26 December 1975, the community resolved to establish its own secondary school,
                    empowering generations of scholars and professionals.
                  </p>
                </div>
                <div className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm">
                  <Users2 className="h-6 w-6 text-gold-700" aria-hidden="true" />
                  <h3 className="mt-3 font-serif font-bold text-purple-900">TIPU Civic Union</h3>
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

          {/* Section 8: Community Memory & Digital Archive Link */}
          <section id="community-memory">
            <div className="rounded-3xl bg-purple-700 p-8 text-white shadow-sm sm:p-10">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Digital Archive
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                    Historical Records &amp; Digital Archives
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                    Explore the preserved historical manuscripts, archival timelines, and detailed documentation
                    of Takete-Ide&rsquo;s rich heritage and settlement journey.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/archive"
                    className="inline-flex items-center justify-center rounded-2xl bg-gold-500 px-6 py-3 text-sm font-semibold text-purple-950 shadow-xs transition hover:bg-gold-400"
                  >
                    Explore the Digital Archive
                  </Link>
                  <Link
                    href="/heritage"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Culture &amp; Heritage
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
