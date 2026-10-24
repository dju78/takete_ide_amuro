import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Takete-Ide Community History — An Overview",
  description:
    "A short overview of Takete-Ide’s history, from the upland settlements to the present town, with links to the community’s history and heritage pages.",
  alternates: {
    canonical: `${siteConfig.url}/archive/from-hilltops-to-the-valley`,
  },
};

const historyTopics = [
  {
    title: "Our Story",
    description:
      "The journey from Amuro-Odo through the upland settlements to the present town around 1926, and the naming of Takete-Idera.",
    href: "/our-story",
  },
  {
    title: "Amuro, Yagba and Okun",
    description: "Takete-Ide’s place within Amuro and the wider Yagba and Okun setting.",
    href: "/heritage/amuro-okun-context",
  },
  {
    title: "Land and Landscape",
    description: "The hills, rivers, streams and neighbouring settlements that shape community life.",
    href: "/heritage/land-and-landscape",
  },
  {
    title: "Faith and Religious Heritage",
    description: "Indigenous worship, the arrival of SIM Christianity in 1919 and the congregations that followed.",
    href: "/heritage/faith",
  },
  {
    title: "Takete-Tedo at Okegada",
    description: "The later movement to Takete-Tedo from 1949 and the communal labour that built it.",
    href: "/our-story/takete-tedo",
  },
  {
    title: "Traditional Institution",
    description: "The Olu’de, the 13 rulers in living memory and the Traditional Council.",
    href: "/heritage/traditional-institution",
  },
  {
    title: "Education",
    description: "From the first SIM school in 1943 to the community’s own secondary school.",
    href: "/education",
  },
  {
    title: "Pacesetters and Pioneers",
    description: "The community’s recorded firsts in education, the professions and public life.",
    href: "/heritage/pacesetters",
  },
  {
    title: "Development",
    description: "Roads, water, health, electricity and the self-help projects of recent decades.",
    href: "/development",
  },
  {
    title: "Festivals",
    description: "Takete-Ide Day, Egungun, Ogun, New Yam and the community’s other celebrations.",
    href: "/heritage/festivals",
  },
  {
    title: "Community Organisations",
    description: "TIPU and the associations that sustain civic life at home and abroad.",
    href: "/heritage/community-organisations",
  },
  {
    title: "Families and Compounds",
    description: "The families and compounds recorded in the Olu’de register.",
    href: "/families",
  },
];

export default function CommunityHistoryOverviewPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Digital Archive", href: "/archive" },
              { label: "Community History Overview" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Community history</p>
              <h1 className="mt-2 max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
                From the Hilltops to the Valley
              </h1>
              <p className="mt-3 max-w-3xl text-white/85">
                A short overview of Takete-Ide&rsquo;s history and where to read more about it on this website.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-14 sm:py-16">
        <section className="prose-heritage max-w-3xl">
          <p>
            Takete-Ide&rsquo;s people trace their origins to Amuro-Odo. Through the upheavals of the nineteenth
            century they moved to defensible upland settlements, Igbo Ide, Ilu-Oke and Okeata among them. Around
            1926, during the reign of Olu&rsquo;de Okoo Elewa, they came down from the hills to the fertile plain
            where the town stands today, first calling it Ileteju and then Takete-Idera.
          </p>
          <p>
            In the century since, the community has built churches and schools, raised a long line of
            pioneers in education and public life, and sustained its development through self-help and the
            Takete-Ide Progressive Union. The full account is told in the community&rsquo;s centenary book,{" "}
            <em>From the Hilltops to the Valley: The History, Heritage, and People of Takete-Ide</em>, published
            by TIPU in 2026.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">Explore Takete-Ide&rsquo;s history</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {historyTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group flex flex-col rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm transition hover:border-purple-600/30 hover:shadow-md"
              >
                <h3 className="font-serif text-lg font-bold text-purple-950">{topic.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/75">{topic.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-community-green">
                  Read more <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
