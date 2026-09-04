import type { Metadata } from "next";
import Link from "next/link";
import {
  Church,
  Sparkles,
  Image as ImageIcon,
  Video,
  ArrowRight,
  ShieldCheck,
  History,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { ChurchCard } from "@/components/faith/ChurchCard";
import { FaithTimeline } from "@/components/faith/FaithTimeline";
import { getAllChurches } from "@/content/heritage/faith/churches";
import { RELIGIOUS_HERITAGE_TIMELINE } from "@/content/heritage/faith/timeline";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Faith & Religious Heritage | Takete-Ide Amuro",
  description:
    "Explore the religious heritage of Takete-Ide, from indigenous beliefs and traditions to the arrival of Christianity and the histories of the community's churches.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/faith`,
  },
  openGraph: {
    title: "Faith & Religious Heritage | Takete-Ide Amuro",
    description:
      "Explore the religious heritage of Takete-Ide, from indigenous beliefs and traditions to the arrival of Christianity and the histories of the community's churches.",
    url: `${siteConfig.url}/heritage/faith`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function FaithHeritagePage() {
  const churches = getAllChurches();

  return (
    <div className="bg-ivory">
      {/* Hero Header */}
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Faith & Religious Heritage" },
            ]}
          />
          <p className="mt-4 inline-block rounded-full bg-gold-500/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            CULTURE &amp; HERITAGE
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Faith &amp; Religious Heritage
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            Faith has formed an important part of Takete-Ide’s cultural and community life across generations.
            From indigenous religious traditions and beliefs to the arrival and growth of Christianity, the
            community’s religious heritage forms an important part of its wider historical journey.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80">
            This archive preserves historical accounts, places of worship, photographs and community records
            relating to the religious life of Takete-Ide. Where dates or details remain under verification, this
            is clearly indicated.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#indigenous-heritage"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-purple-950 transition-colors hover:bg-gold-400"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Indigenous Religious Heritage
            </a>
            <a
              href="#churches"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <Church className="h-4 w-4" aria-hidden="true" />
              Churches of Takete-Ide
            </a>
            <a
              href="#timeline"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              <History className="h-4 w-4" aria-hidden="true" />
              Religious Heritage Timeline
            </a>
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        <ResearchDisclaimer />

        {/* SECTION A: INDIGENOUS RELIGIOUS HERITAGE */}
        <section id="indigenous-heritage" className="mt-14 scroll-mt-20">
          <SourcedSection
            title="Indigenous Religious Heritage of Takete-Ide"
            status="community_tradition"
            sourceNote="Preserved in the supplied community historical manuscript and living oral traditions."
          >
            <div className="space-y-4">
              <p>
                Long before the introduction of world religions, the people of Takete-Ide possessed an established,
                coherent indigenous religious worldview. At the centre of this belief system was faith in a Supreme
                Being, known in Yoruba religious cosmology as <strong>Orisa Oke</strong>, <strong>Olu Orun</strong>{" "}
                (King of Heaven), and <strong>Obarisa</strong> (the Sovereign over all spiritual manifestations).
              </p>
              <p>
                Community religious practice was an integral aspect of everyday existence and communal solidarity. It
                encompassed structured forms of <strong>prayer</strong>, <strong>libation</strong>, <strong>sacrifice</strong>,{" "}
                <strong>divination</strong>, and consultation with recognized spiritual intermediaries, including traditional
                priests, seers, and diviners who assisted the community in seeking peace, healing, fertility, and
                protection from adversity.
              </p>

              {/* Groupings & Masquerade Traditions Card */}
              <div className="my-6 grid gap-6 rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-2">
                <div className="rounded-2xl border border-gold-200/70 bg-gold-50/50 p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold-800">
                    Traditional Groupings
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-bold text-purple-950">
                    Agado &amp; Oliwo Traditions
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    The supplied community manuscript records two principal traditional religious groupings in ancient
                    Ilu-Oke: <strong>Agado</strong> and <strong>Oliwo</strong>. Each group observed three-day annual
                    ceremonies and worship cycles (associated with Epa, Oro, and Egungun festivities), timed with the onset
                    of the rains between May and June, culminating in communal consultations and declarations of blessing.
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200/70 bg-purple-50/40 p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
                    Masquerade &amp; Cultural Lineages
                  </span>
                  <h3 className="mt-1 font-serif text-lg font-bold text-purple-950">
                    Sacred Masks &amp; Deities
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/80">
                    The manuscript preserves traditions of diverse masquerades including <strong>Akorowo</strong> (the
                    whistling opening herald), <strong>Ate</strong> (feathered and glass-laced), <strong>Origi</strong>,{" "}
                    <strong>Apa Rege Rege</strong>, and <strong>Otutumoba</strong>, alongside veneration of goddesses{" "}
                    <strong>Otegun</strong> and <strong>Orisa</strong> by women, and cultural associations such as{" "}
                    <strong>Alase</strong>, <strong>Ojingindo</strong>, <strong>Saaji</strong>, <strong>Erembe</strong>, and{" "}
                    <strong>Iro</strong>.
                  </p>
                </div>
              </div>

              {/* Editorial terminology note */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/30 p-4 text-xs text-charcoal/70">
                <p>
                  <strong>Historical Terminology Note:</strong> Early European missionary writings often used older
                  labels such as <em>&ldquo;pagan&rdquo;</em> or <em>&ldquo;idol worshipper&rdquo;</em>. Modern community
                  heritage scholarship recognizes these terms as reflective of 19th- and early 20th-century missionary
                  perspectives rather than an accurate description of the indigenous spiritual worldview, in which physical
                  representations served as intermediaries directed toward the Supreme Creator.
                </p>
              </div>

              {/* Cross-links to dedicated heritage pages */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/heritage/agado"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-900 shadow-xs transition-colors hover:bg-purple-50"
                >
                  Explore Agado Heritage →
                </Link>
                <Link
                  href="/heritage/ate"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-900 shadow-xs transition-colors hover:bg-purple-50"
                >
                  Explore Ate (Egungun) Heritage →
                </Link>
                <Link
                  href="/heritage/agbagba-ide"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-900 shadow-xs transition-colors hover:bg-purple-50"
                >
                  Explore Agbagba Ide Sanctuary →
                </Link>
              </div>
            </div>
          </SourcedSection>

          {/* Authentic Egungun Festival Video Player Feature */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm">
            <div className="border-b border-purple-600/10 bg-gradient-to-r from-purple-900 to-purple-800 px-6 py-4 text-white">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-gold-400" aria-hidden="true" />
                <h3 className="font-serif text-lg font-bold">
                  Egungun Festival — Living Cultural &amp; Masquerade Heritage
                </h3>
              </div>
              <p className="mt-1 text-xs text-white/80">
                Authentic community video recording documenting Egungun masquerade celebrations and cultural gathering in Takete-Ide.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-black shadow-md">
                <video
                  controls
                  preload="metadata"
                  className="aspect-video w-full"
                  aria-label="Egungun Festival cultural video recording from Takete-Ide"
                >
                  <source src="/videos/takete-ide/egungun-festival.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mx-auto mt-4 max-w-3xl text-xs text-charcoal/70">
                <p>
                  <strong>Video Archive Record:</strong> Community recording of Egungun Festival masquerade processions,
                  drumming and community gathering in Takete-Ide. Masquerade traditions celebrate ancestral lineage,
                  communal solidarity, and seasonal blessings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B: CHRISTIANITY COMES TO YAGBA */}
        <section id="christianity-comes-to-yagba" className="mt-16 scroll-mt-20">
          <SourcedSection
            title="Christianity Comes to Yagba"
            status="documentary_evidence"
            sourceNote="Regional mission history preserved in Sudan Interior Mission (SIM) records and secondary historical accounts."
          >
            <div className="space-y-4">
              <p>
                To understand how Christianity reached Takete-Ide, it is essential to examine the regional work of the{" "}
                <strong>Sudan Interior Mission (SIM)</strong> across the wider Yagba region at the beginning of the
                twentieth century.
              </p>
              <p>
                In <strong>1905</strong>, <strong>Mr. E. P. Lang</strong>, a missionary affiliated with the SIM station at
                Patigi, trekked across the terrain to <strong>Ogga</strong> in present-day Yagba West, where he encountered
                a local convert, Mr. Daniel Orisanaiye, reading a Yoruba Bible. Lang returned on subsequent visits in 1906 and
                1907, celebrating one of the earliest recorded missionary Christmas gatherings in the area.
              </p>
              <p>
                In <strong>1908</strong>, <strong>Rev. Tommie (Thomas) Titcombe</strong> arrived in Yagbaland and established a
                major SIM mission base at <strong>Egbe</strong>. Titcombe quickly learned to communicate fluently in the local
                Yagba dialect, blending evangelism with medical assistance and community care.
              </p>
              <p>
                In <strong>May 1909</strong>, Titcombe preached his first recorded sermon in the Yagba language inside the Egbe
                market. A few months later, on <strong>31 October 1909</strong>, the first recorded SIM baptism in Yagbaland
                took place at Ogga, where ten men and three women were baptised. Following the arrival of Rev. W. Playfair in
                1911, a large baptism of 119 converts took place at Egbe in <strong>1912</strong>, followed by the convening
                of the first <strong>Egbe Annual Conference in 1915</strong>.
              </p>
              <div className="rounded-2xl border-l-4 border-gold-500 bg-gold-50/60 p-4 text-sm font-medium text-purple-950">
                &ldquo;From mission centres such as Ogga and Egbe, Christian missionary activity gradually extended to
                surrounding Yagba communities, including Takete-Ide.&rdquo;
              </div>
            </div>
          </SourcedSection>
        </section>

        {/* SECTION C: CHRISTIANITY REACHES TAKETE-IDE */}
        <section id="christianity-reaches-takete-ide" className="mt-16 scroll-mt-20">
          <SourcedSection
            title="Christianity Reaches Takete-Ide"
            status="documentary_evidence"
            sourceNote="Preserved First Baptist Church historical account and community archive records."
          >
            <div className="space-y-4">
              <p>
                The historical record establishes that by <strong>1922</strong>, an active Christian congregation
                under the Sudan Interior Mission (SIM) was already operating in Takete-Ide.
              </p>
              <p>
                In 1922, <strong>Rev. Tommie Titcombe</strong> visited Takete-Ide while preparations were underway for an
                early baptismal service. During this visit, he reiterated the SIM doctrinal requirement concerning
                monogamy as a prerequisite for water baptism. Some converts who had embraced the Christian faith while
                in polygamous marriages found themselves unwilling to dissolve established families.
              </p>
              <p>
                Committed to remaining within the Christian faith rather than returning to traditional worship, a group
                of believers led by <strong>Pa Joash Agunbiade</strong> turned to the <strong>Baptist Mission</strong>,
                which was already firmly established in neighbouring Mopa. In <strong>November 1922</strong>, they founded
                the <strong>First Baptist Church, Takete-Ide</strong>.
              </p>

              {/* 1919 Community Record Verification Callout */}
              <div className="rounded-2xl border border-gold-300/80 bg-gold-50/70 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" aria-hidden="true" />
                  <div>
                    <h4 className="font-serif text-base font-bold text-purple-950">
                      1919 Introduction Reference in Community Records
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-charcoal/80">
                      The Takete-Ide community historical record preserves a traditional reference to{" "}
                      <strong>1919</strong> as the year SIM Christianity was first introduced into Takete-Ide. In
                      accordance with archival standards, this milestone is recorded as{" "}
                      <em>&ldquo;1919 — SIM Christianity introduced in Takete-Ide, according to the community historical record&rdquo;</em>,
                      rather than an uncorroborated church founding date, pending ongoing verification from early mission registers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SourcedSection>
        </section>

        {/* SECTION D: CHURCHES OF TAKETE-IDE */}
        <section id="churches" className="mt-16 scroll-mt-20">
          <SectionHeading
            eyebrow="Congregations & Places of Worship"
            title="Churches of Takete-Ide"
            align="left"
            className="mx-0"
            description="Christian congregations have played an important role in the religious and community life of Takete-Ide across generations. This directory preserves their names, photographs and historical records as reliable information becomes available."
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {churches.map((church) => (
              <ChurchCard key={church.id} church={church} />
            ))}
          </div>
        </section>

        {/* SECTION E: RELIGIOUS HERITAGE TIMELINE */}
        <section id="timeline" className="mt-20 scroll-mt-20">
          <div className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-10 lg:p-12">
            <SectionHeading
              eyebrow="Chronological Archive"
              title="Religious Heritage Timeline"
              align="left"
              className="mx-0"
              description="A chronological overview of indigenous traditions, regional missionary developments in Yagba, and the arrival and development of churches in Takete-Ide."
            />

            <div className="mt-12">
              <FaithTimeline entries={RELIGIOUS_HERITAGE_TIMELINE} />
            </div>
          </div>
        </section>

        {/* SECTION F: RELIGIOUS HERITAGE GALLERY & PHOTOGRAPHIC ARCHIVE */}
        <section className="mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-purple-800 to-purple-900 p-8 text-white shadow-md sm:p-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
                  <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Photographic Archive
                </span>
                <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                  Places of Worship Gallery
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
                  Explore authentic community photographs documenting places of worship across Takete-Ide — from
                  historic mud-and-timber structures to present-day church sanctuaries.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/gallery?category=Places+of+Worship"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold text-purple-950 shadow-xs transition-colors hover:bg-gold-400"
                >
                  View Places of Worship Gallery
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/heritage"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  Culture &amp; Heritage Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
