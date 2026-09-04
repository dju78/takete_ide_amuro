import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Users,
  Sparkles,
  UserCheck,
  ArrowLeft,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { VerificationBox } from "@/components/faith/VerificationBox";
import { FIRST_BAPTIST_HISTORY } from "@/content/heritage/faith/first-baptist";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "First Baptist Church, Takete-Ide | History & Heritage",
  description:
    "Discover the history of First Baptist Church, Takete-Ide, established in November 1922, including its founders, early worship places, leadership and community heritage.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/faith/first-baptist-church`,
  },
  openGraph: {
    title: "First Baptist Church, Takete-Ide | History & Heritage",
    description:
      "Discover the history of First Baptist Church, Takete-Ide, established in November 1922, including its founders, early worship places, leadership and community heritage.",
    url: `${siteConfig.url}/heritage/faith/first-baptist-church`,
    siteName: siteConfig.name,
    type: "article",
  },
};

export default function FirstBaptistChurchHistoryPage() {
  return (
    <div className="bg-ivory">
      {/* Hero Header */}
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Faith & Religious Heritage", href: "/heritage/faith" },
              { label: "First Baptist Church" },
            ]}
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
              COMMUNITY HERITAGE ARCHIVE
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              Established November 1922
            </span>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {FIRST_BAPTIST_HISTORY.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg font-medium text-gold-300 sm:text-xl">
            {FIRST_BAPTIST_HISTORY.subtitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            Preserved historical account documenting the establishment, founding fathers, early worship
            sanctuaries, pastoral ministry, and enduring community contributions of First Baptist Church in
            Takete-Ide since 1922.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/heritage/faith"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Faith &amp; Religious Heritage
            </Link>
            <a
              href="#founders"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-purple-950 transition-colors hover:bg-gold-400"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              The Six Founders
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {/* Verification Alert / Archive Note */}
        <VerificationBox
          title="Community Heritage Record"
          sourceDescription="This history is based on a historical account preserved by the church and community. Some names, dates and details remain subject to confirmation from church registers and elders."
          notes={FIRST_BAPTIST_HISTORY.verificationNotes}
        />

        {/* Lead Image & Caption */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
          <div className="relative aspect-[16/9] w-full max-h-[28rem] bg-purple-900/10">
            <HeritageImage
              src="/images/takete-ide/places/first-baptist-church.jpg"
              alt="First Baptist Church building in Takete-Ide with hills visible behind"
              label="First Baptist Church, Takete-Ide"
              fill
              priority
              sizes="(min-width: 1280px) 1100px, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="p-5 sm:p-6 bg-purple-50/40 border-t border-purple-600/10">
            <p className="text-xs italic text-charcoal/75">
              <strong>Present-day building:</strong> First Baptist Church, Takete-Ide — modern church sanctuary
              surrounded by the natural topography of the community.
            </p>
          </div>
        </div>

        <div className="mt-14 space-y-16">
          {/* 1. THE BIRTH OF THE BAPTIST MISSION */}
          <section id="birth-of-mission">
            <SourcedSection
              title="1. The Birth of the Baptist Mission"
              status="documentary_evidence"
              sourceNote="Preserved First Baptist Church historical account."
            >
              <p>
                In the early decades of the twentieth century, Christian missionary activity in the Yagba area
                presented baptism as the decisive mark of full acceptance of the Gospel of Jesus Christ. The
                original account explains that baptism signified that a believer had embraced Biblical teaching
                and departed from past practices. One central requirement emphasized by the early Sudan Interior
                Mission (SIM) missionaries was the doctrine of <strong>one man, one wife</strong> (strict monogamy).
              </p>
              <p>
                A number of men in the community who responded positively to the Christian message were already
                in polygamous family arrangements according to traditional custom. The SIM missionaries required
                candidates to separate from wives as a condition for receiving water baptism. While some converts
                made this difficult sacrifice, others were unwilling to dissolve established matrimonial unions.
              </p>
              <p>
                In <strong>1922</strong>, <strong>Rev. Tommie Titcombe</strong> visited Takete-Ide while
                preparations were underway for an early baptismal service. He reiterated the SIM requirement of one
                wife before baptism. Rather than abandoning Christianity or returning to their former way of life,
                a committed group led by <strong>Pa Joash Agunbiade</strong> resolved to associate with the{" "}
                <strong>Baptist Mission</strong>, which was already firmly established in nearby Mopa.
              </p>
            </SourcedSection>
          </section>

          {/* 2. FOUNDING OF FIRST BAPTIST CHURCH - 1922 */}
          <section id="founding">
            <SourcedSection
              title="2. Founding of First Baptist Church — 1922"
              status="documentary_evidence"
              sourceNote="Documented in preserved church historical account."
            >
              <p>
                In <strong>November 1922</strong>, six men, acting in concert with the steadfast cooperation of
                their wives, formally established the <strong>First Baptist Church in Takete-Ide</strong>.
              </p>
              <p>
                The new congregation organized regular Christian worship services, prayer meetings, and mutual
                support, establishing a distinct denominational fellowship that grew rapidly into an integral
                pillar of community life.
              </p>
            </SourcedSection>
          </section>

          {/* 3. THE SIX FOUNDERS */}
          <section id="founders">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-700" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  3. The Six Founders
                </h2>
              </div>
              <p className="mt-2 text-sm text-charcoal/75">
                The original historical manuscript lists six founding fathers who, with their wives, established
                the church in November 1922:
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FIRST_BAPTIST_HISTORY.founders.map((founder, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5 transition-shadow hover:shadow-xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-xs font-bold text-white">
                      {idx + 1}
                    </div>
                    <h3 className="mt-3 font-serif text-base font-bold text-purple-950">
                      {founder.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-gold-800">
                      {founder.role}
                    </p>
                    {founder.notes && (
                      <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                        {founder.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-gold-200 bg-gold-50/60 p-4 text-xs text-charcoal/80">
                <p>
                  <strong>Office Bearers:</strong> The source records that <strong>Pa Joash Agunbiade</strong> served
                  as <em>Baba Egbe</em>, and <strong>Pa Luke Olorunleke</strong> served as <em>Church Leader</em>. A
                  subsequent paragraph identifies <strong>Noah Eseyin</strong> as <em>Church Secretary</em> (see
                  verification note regarding the relationship between the names Pa Noah Omoyele and Noah Eseyin).
                </p>
              </div>
            </div>
          </section>

          {/* 4. EARLY WORSHIP PLACES AND CHURCH BUILDINGS */}
          <section id="buildings">
            <SourcedSection
              title="4. Early Worship Places and Church Buildings"
              status="documentary_evidence"
              sourceNote="Preserved First Baptist Church historical account."
            >
              <div className="space-y-4">
                <p>
                  The congregation&rsquo;s physical journey reflects the resilience and resourcefulness of its early
                  members:
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                      First Worship Site
                    </span>
                    <h4 className="mt-1 font-serif text-base font-bold text-purple-950">
                      Initial Location &amp; Mud Seats
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                      At the first site, the close proximity to the SIM (ECWA) place of worship led to a mutual
                      decision to relocate to avoid disturbing concurrent services. The congregation erected a mud
                      building with hand-fashioned mud seats due to lack of funds for wooden benches.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">
                      Present Site (1959)
                    </span>
                    <h4 className="mt-1 font-serif text-base font-bold text-purple-950">
                      Thatched Roof to Corrugated Iron
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                      The church later moved to its permanent present location, constructing an auditorium with a
                      thatched roof. In <strong>1959</strong>, through collective community contributions, the thatched
                      roof was replaced with durable corrugated iron sheets.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-community-green">
                      Modern Era (Mid-1980s)
                    </span>
                    <h4 className="mt-1 font-serif text-base font-bold text-purple-950">
                      Modern Church Auditorium
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-charcoal/75">
                      In the mid-1980s, growing membership necessitated the construction of the spacious modern
                      auditorium that stands on the church grounds today.
                    </p>
                  </div>
                </div>
              </div>
            </SourcedSection>
          </section>

          {/* 5. EARLY PASTORAL SUPPORT */}
          <section id="early-pastors">
            <SourcedSection
              title="5. Early Pastoral Support"
              status="documentary_evidence"
              sourceNote="Documented in preserved church historical account."
            >
              <p>
                In its formative years, First Baptist Church received vital pastoral guidance from visiting and
                resident ministers from neighbouring regions:
              </p>
              <ul className="mt-4 space-y-3 text-sm text-charcoal/85">
                <li>
                  • <strong>Rev. Margi (c. 1924):</strong> An Igede Baptist minister who visited the young church
                  regularly for one to two weeks at a time, sleeping inside the small auditorium.
                </li>
                <li>
                  • <strong>Rev. Agbode (1925):</strong> Also from Igede; arrived in 1925 as the church&rsquo;s first
                  resident pastor.
                </li>
                <li>
                  • <strong>Subsequent Early Pastors:</strong> Pastor Olaleken, Pastor David Otitodun, and Pastor
                  Adeosun.
                </li>
                <li>
                  • <strong>Teacher-Pastors:</strong> Primary-school teachers posted to Takete-Ide who also served the
                  pulpit, including Pastor Ajibade from Oyo State and Pastor Falana from Ekirin-Adde.
                </li>
                <li>
                  • <strong>Student Pastors:</strong> Pastor Adetunji from Saki, Oyo State, who served as student
                  pastor for three months.
                </li>
              </ul>
            </SourcedSection>
          </section>

          {/* 6. PASTORAL LEADERSHIP, 1982–1990 */}
          <section id="pastoral-1982-1990">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-purple-700" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  6. Pastoral Leadership, 1982–1990
                </h2>
              </div>
              <p className="mt-2 text-sm text-charcoal/75">
                The manuscript documents a significant period of pastoral transition involving traditional and
                ordained leaders:
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-purple-950">
                      HRH Oba Philip Ebilakun
                    </h3>
                    <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-800">
                      1982–1985 &amp; 1988–1990
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    HRH Oba Philip Ebilakun, the reigning Olude of Takete-Ide at the time of the source account,
                    served as Church Pastor from 1982 to 1985. Following the tenure of Rev. Oyekunle (1985–1988), Oba
                    Ebilakun stepped in once again to lead the church as pastor from 1988 to 1990.
                  </p>
                </div>

                <div className="rounded-2xl border border-gold-100 bg-gold-50/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-purple-950">
                      Rev. Oyekunle
                    </h3>
                    <span className="rounded-full bg-gold-100 px-3 py-0.5 text-xs font-bold text-gold-900">
                      1985–1988
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    Served as Church Pastor between Oba Ebilakun&rsquo;s two pastoral tenures, ministering to the
                    congregation during an important era of expansion.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-purple-950">
                      Rev. Agbogun
                    </h3>
                    <span className="rounded-full bg-purple-100 px-3 py-0.5 text-xs font-bold text-purple-800">
                      Inducted Aug 1990; Ordained 14 Nov 1990
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    Inducted as Church Pastor in August 1990 and ordained as a full minister on 14 November 1990,
                    continuing his pastoral service up to the time the source account was written.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. AIYEDAYO ROAD AND CHURCH LAND */}
          <section id="church-land">
            <SourcedSection
              title="7. Aiyedayo Road and Church Land"
              status="documentary_evidence"
              sourceNote="Preserved church historical account."
            >
              <p>
                As Takete-Ide expanded, community leaders identified the need for a direct access road connecting the
                Otafun/Aghara and Takete-Ide/Aiyede axes toward Oroke (Aiyedayo). The original direct alignment would
                have intersected directly in front of the local primary school&rsquo;s main gate, creating safety
                concerns for schoolchildren.
              </p>
              <p>
                Community leaders approached First Baptist Church for permission to route the new road through its
                land holdings farther away from the school gate. In a spirit of civic cooperation, the church agreed.
                The land was partitioned, with one portion bordering the property of <strong>Pa Joash Agunbiade</strong> on
                the Oke Adan side, and another remaining on the present church premises.
              </p>
              <p>
                From its early demarcation, the church land shared boundaries with Pa Agunbiade on the Oke Adan side,
                with <strong>Pa Elehire</strong> on the Olorunsogo side, extending toward the Oke-Ako bypass near the
                house of <strong>Baba Ajayi Yeloyejo</strong>.
              </p>
            </SourcedSection>
          </section>

          {/* 8. GROWTH AND THE LEGACY OF PA ALFRED ESEYIN */}
          <section id="pa-alfred-eseyin">
            <div className="rounded-3xl border-2 border-gold-400/50 bg-gold-50/60 p-6 sm:p-10">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-gold-700" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  8. Growth and the Legacy of Pa Alfred Eseyin (Baba Owa)
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/85">
                Among the six founders, <strong>Pa Alfred Eseyin (popularly revered as Baba Owa)</strong> was the last
                surviving patriarch. He left an indelible spiritual and cultural mark on generations of church members.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/85">
                Baba Owa was renowned for his unwavering devotion, attending early-morning prayer vigils at 5:00 a.m.,
                evening prayer services, regular Sunday worship, and actively teaching Sunday School classes. When
                invited to give the closing prayer, he concluded consistently with a memorable invocation:
              </p>

              <blockquote className="my-5 rounded-2xl border-l-4 border-gold-600 bg-white p-5 font-serif text-sm italic text-purple-950 sm:text-base">
                &ldquo;Bope wani, bo yawa ni, odo Re na lanmbo wa simi. Kiwa kabo ka le je omo odo rere lodo Re, ni
                oruko ti Jesu Kristi Oluwa wa. Amin.&rdquo;
              </blockquote>

              <p className="text-xs text-charcoal/70">
                (Translation concept: <em>&ldquo;Whether late or early, unto You we shall return to rest. May our homecoming find us as faithful servants before You, in the name of Jesus Christ our Lord. Amen.&rdquo;</em>)
              </p>
            </div>
          </section>

          {/* 9. THE CHURCH FARM */}
          <section id="church-farm">
            <SourcedSection
              title="9. The Church Farm"
              status="documentary_evidence"
              sourceNote="Preserved First Baptist Church historical account."
            >
              <p>
                From its early years, First Baptist Church instituted a communal agricultural initiative known as the{" "}
                <strong>Church Farm</strong>.
              </p>
              <p>
                Fridays were customarily dedicated for congregation members—men and women alike—to labour together on
                the church farm. Proceeds from the sale of harvested farm produce were channelled directly into funding
                church administration, missionary hospitality, and maintenance of church properties, demonstrating
                the community&rsquo;s self-reliance.
              </p>
            </SourcedSection>
          </section>

          {/* 10. LATER LEADERSHIP */}
          <section id="later-leadership">
            <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-10">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-700" aria-hidden="true" />
                <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                  10. Later Leadership &amp; Community Stalwarts
                </h2>
              </div>
              <p className="mt-2 text-sm text-charcoal/75">
                As the founding generation aged and passed on, their children and subsequent members assumed
                stewardship. The historical record commemorates the following prominent leaders of blessed memory:
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {FIRST_BAPTIST_HISTORY.laterLeaders.map((leader, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/30 p-4"
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full bg-purple-600" />
                    <span className="font-serif text-sm font-bold text-purple-950">{leader}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. HISTORICAL GALLERY */}
          <section id="gallery">
            <SectionHeading
              eyebrow="Archival Photography"
              title="11. Historical Gallery"
              align="left"
              className="mx-0"
              description="Authentic community photographs of First Baptist Church premises and grounds."
            />

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <HeritageImage
                    src="/images/takete-ide/places/first-baptist-church.jpg"
                    alt="First Baptist Church building in Takete-Ide"
                    label="First Baptist Church Sanctuary"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-purple-50/30">
                  <p className="text-xs font-semibold text-purple-950">First Baptist Church Building</p>
                  <p className="text-xs italic text-charcoal/60">Present-day sanctuary building in Takete-Ide.</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <HeritageImage
                    src="/images/takete-ide/places/first-baptist-church-grounds.jpg"
                    alt="First Baptist Church grounds and surrounding landscape at Takete-Ide"
                    label="First Baptist Church Grounds"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-purple-50/30">
                  <p className="text-xs font-semibold text-purple-950">Church Grounds &amp; Compound</p>
                  <p className="text-xs italic text-charcoal/60">Surrounding church grounds and landscape in Takete-Ide.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/gallery?category=Places+of+Worship"
                className="inline-flex items-center gap-2 text-sm font-semibold text-community-green hover:underline"
              >
                View all places of worship in the Community Gallery →
              </Link>
            </div>
          </section>

          {/* 12. SOURCES & VERIFICATION */}
          <section id="sources-and-verification">
            <SourcedSection
              title="12. Sources & Archival Provenance"
              status="documentary_evidence"
              sourceNote="Two-page photographed church history supplied for the Takete-Ide community website."
            >
              <p>
                This historical narrative is transcribed and edited from a preserved two-page written historical
                account of First Baptist Church, Takete-Ide, supplied to the community digital archive.
              </p>
              <p>
                In keeping with the project&rsquo;s historical accuracy standards, spelling variations, dates, and
                leadership records remain under continuous review with church registers and community elders.
              </p>
            </SourcedSection>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-purple-600/15 pt-8">
          <Link
            href="/heritage/faith"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:underline"
          >
            ← Back to Faith &amp; Religious Heritage
          </Link>
          <Link
            href="/heritage"
            className="inline-flex items-center gap-2 text-sm font-semibold text-community-green hover:underline"
          >
            Explore Culture &amp; Heritage Home →
          </Link>
        </div>
      </Container>
    </div>
  );
}
