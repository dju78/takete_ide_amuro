import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The origins, settlement history and evolution of Takete-Ide Amuro in Mopamuro LGA, Kogi State.",
};

const toc = [
  "Location",
  "Origins",
  "Settlement History",
  "Community Development",
  "Christianity and Education",
  "Governance",
  "Modern Takete-Ide",
  "Historical Timeline",
];

export default function OurStoryPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Our Story" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our Story</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Welcome to Takete-Ide — the story of our origins, settlement and the community we have become.
          </p>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28 text-sm">
            <p className="mb-3 font-semibold uppercase tracking-wide text-charcoal/50">On this page</p>
            <ul className="space-y-2 border-l border-purple-600/15 pl-4">
              {toc.map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-charcoal/70 hover:text-purple-600">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex flex-col gap-12">
          <ResearchDisclaimer />

          <SourcedSection
            title="Location"
            status="community_tradition"
            sourceNote="Compiled from published community summaries; awaiting confirmation from the traditional council."
          >
            <p>
              Takete-Ide (also recorded as <em>Itakete Ide</em>) is a community within the Amuro district of
              Mopamuro Local Government Area, Kogi State, Nigeria, positioned in the Yagba-speaking cultural
              zone of Kogi West.
            </p>
            <p>
              It is one of the constituent communities of Amuro land, alongside neighbouring settlements
              such as Orokere, Aiyede and Otafun. The community is traditionally headed by a local ruler,
              with the community stool represented by the Olude of Takete-Ide Amuro.
            </p>
          </SourcedSection>

          <SourcedSection
            title="Origins"
            status="oral_history"
            sourceNote="Oral tradition as recorded in secondary community sources — not yet cross-checked with family/compound elders."
          >
            <p>
              Oral tradition links Takete-Ide&rsquo;s ancestry to the Yagba sub-ethnic group, with accounts
              describing a westward migration journey that founded settlements in what is now western Kogi
              State, tracing ancestral roots toward Ile-Ife, the spiritual home of the Yoruba people.
            </p>
            <p>
              As with most oral-tradition accounts of settlement, details of the exact route, timing and
              named ancestors vary between tellings and require further documentation from recognised
              family and compound sources before they can be presented as settled fact.
            </p>
          </SourcedSection>

          <SourcedSection
            title="Settlement History"
            status="community_tradition"
            sourceNote="Community accounts describe an early hill settlement followed by relocation to the plains."
          >
            <p>
              Community accounts describe an original settlement on a defensive hilltop retreat, historically
              known as Ilu-Oke (&ldquo;Town on the Hill&rdquo;), chosen for its defensible position during a
              period of regional conflict. To gain better access to arable land, the community is said to have
              relocated to its current location on the plains — historically referred to afterward as
              Takete-Ide — with some sources placing this move around 1926.
            </p>
            <p>
              Takete-Ide exists as part of a wider confederation of Amuro communities, historically described
              as an alliance formed for mutual defence against external conflicts and slave raids. Sources
              differ on the exact number and names of constituent communities, which is a documented open
              question for this archive.
            </p>
          </SourcedSection>

          <SourcedSection
            title="Community Development"
            status="community_tradition"
            sourceNote="Reflects the community's own self-help narrative; infrastructure details should be verified against Development section records."
          >
            <p>
              Takete-Ide is primarily an agrarian community that has relied heavily on community-driven
              self-help efforts to build schools, health facilities and civic infrastructure, in the context
              of longstanding gaps in state and federal infrastructure provision — particularly for access
              roads and bridges connecting Takete-Ide to neighbouring communities.
            </p>
            <p>
              See the <Link href="/development" className="text-community-green underline underline-offset-2">Development</Link>{" "}
              section for project-by-project detail, each with its own verification and funding status.
            </p>
          </SourcedSection>

          <SourcedSection
            title="Christianity and Education"
            status="community_tradition"
            sourceNote="Dates (1919 introduction; 24 May 1939 bell arrival) are as recorded in supplied source material and have not yet been cross-checked against church records."
          >
            <p>
              The community has a long-standing Christian history. Community accounts describe Christianity
              being introduced to Takete-Ide in 1919 through the pioneering efforts of the Sudan Interior
              Mission (SIM), whose work in the area later evolved into the Evangelical Church Winning All
              (ECWA).
            </p>
            <p>
              A locally significant account — sometimes called the Legend of the Agogo — describes an early
              convert undertaking a long overland journey on foot to Lagos to procure an iron church bell
              (&ldquo;agogo&rdquo;), said to have arrived in the community on 24 May 1939. The bell is
              reported to remain a physical artifact in the community today. This account is preserved here
              as community tradition pending documentary confirmation (e.g. church records) — see{" "}
              <Link href="/archive/oral-history" className="text-community-green underline underline-offset-2">
                Voices of Takete-Ide
              </Link>{" "}
              for related oral-history recordings as they become available.
            </p>
            <p>
              The arrival of Christian missions is described as having brought Western education and
              primary healthcare to the community, contributing to Takete-Ide&rsquo;s first generation of
              formally educated professionals and civil servants.
            </p>
          </SourcedSection>

          <SourcedSection
            title="Governance"
            status="community_tradition"
            sourceNote="Traditional-institution structure per community sources; individual rulers' names and reign dates are not published here until verified — see the Traditional Institution page."
          >
            <p>
              Takete-Ide is traditionally governed by its own monarch, the Olude of Takete-Ide Amuro. At the
              level of the wider Amuro confederation, Takete-Ide pays allegiance to the Alamuro of Amuro
              Land, reported to hold First Class chieftaincy status within the broader traditional structure.
            </p>
            <p>
              Details of individual rulers — names, reign dates and biographies — are deliberately not
              published on this page until confirmed by the traditional council; see{" "}
              <Link href="/heritage/traditional-institution" className="text-community-green underline underline-offset-2">
                Traditional Institution
              </Link>
              .
            </p>
          </SourcedSection>

          <SourcedSection
            title="Modern Takete-Ide"
            status="unverified"
            sourceNote="Reflects publicly reported discussion of a proposed Amuro-area LGA; official status should be confirmed before treating as current."
          >
            <p>
              Takete-Ide has featured in ongoing regional discussion about local government reorganisation in
              Kogi West, including proposals associating the Amuro Development Association with a potential
              new local government area. This remains a live, evolving civic topic rather than a settled
              historical fact, and is presented here for awareness only.
            </p>
          </SourcedSection>

          <SourcedSection title="Historical Timeline" status="unverified" sourceNote="Dates shown are those reported in available sources; each requires independent confirmation.">
            <ul>
              <li><strong>c. 1919</strong> — Christianity introduced to the community via the Sudan Interior Mission.</li>
              <li><strong>c. 1926</strong> — Community relocation from the Ilu-Oke hill settlement to the plains.</li>
              <li><strong>24 May 1939</strong> — Arrival of the church bell (&ldquo;agogo&rdquo;) associated with the Legend of the Agogo.</li>
              <li><strong>Present day</strong> — Annual Takete-Ide Day celebrations continue to bring together indigenes at home and in the diaspora.</li>
            </ul>
          </SourcedSection>
        </div>
      </Container>
    </div>
  );
}
