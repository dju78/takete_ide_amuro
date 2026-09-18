import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeartPulse, Stethoscope, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import { BOOK_HEALTH_HISTORY } from "@/content/history/web/from-hilltops-to-valley-expanded";

const healthFacilities = [
  {
    title: "Takete-Ide Primary Health Centre",
    src: "/images/takete-ide/places/takete-ide-primary-health-centre.jpg",
    alt: "Takete-Ide Primary Health Centre building in Takete-Ide",
    description: "The Primary Health Centre serving residents of Takete-Ide and the surrounding community in Mopamuro LGA.",
    badge: "Community Healthcare",
  },
  {
    title: "Old Health Centre",
    src: "/images/takete-ide/places/takete-ide-old-health-centre.jpg",
    alt: "The former Old Health Centre building in Takete-Ide",
    description: "The former health centre facility preserved in the community's historical architectural record.",
    badge: "Historical Health Facility",
  },
];

export const metadata: Metadata = {
  title: "Health History of Takete-Ide",
  description:
    "Historical healthcare in Takete-Ide, from indigenous healing and the first dispenser to nurses, maternity services and the ECWA clinic.",
  alternates: {
    canonical: `${siteConfig.url}/heritage/health-history`,
  },
};

export default function HealthHistoryPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Culture & Heritage", href: "/heritage" },
              { label: "Health History" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <HeartPulse className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Community health heritage</p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Health History of Takete-Ide</h1>
              <p className="mt-3 max-w-3xl text-white/85">
                A historical record of indigenous healing, missionary medicine, the first dispenser,
                early nurses and midwives, maternity services and clinic development.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-5xl py-14 sm:py-16">
        {/* Health Facilities Photographic Record */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold-700">Health Infrastructure</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                Community Health Facilities
              </h2>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/80">
            Photographic record of health facilities serving Takete-Ide residents across generations.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {healthFacilities.map((facility) => (
              <article
                key={facility.title}
                className="overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-purple-50">
                  <Image
                    src={facility.src}
                    alt={facility.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-community-green">{facility.badge}</p>
                  <h3 className="mt-1 font-serif text-lg font-bold text-purple-950">{facility.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-charcoal/75">{facility.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14">
          <SourcedSection
            title="From Indigenous Healing to Modern Community Health Services"
          >
            <p>
              Healthcare formed an essential dimension of Takete-Ide&rsquo;s twentieth-century social
              transformation, bridging older indigenous healing traditions with the advent of missionary healthcare,
              trained local practitioners, and community-built clinics.
            </p>
          </SourcedSection>
        </div>

        <div className="mt-10 space-y-5">
          {BOOK_HEALTH_HISTORY.map((item, index) => (
            <article key={item.title} className="rounded-3xl border border-purple-600/10 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-community-green">
                  {index === 0 ? <UsersRound className="h-5 w-5" aria-hidden="true" /> : <Stethoscope className="h-5 w-5" aria-hidden="true" />}
                </span>
                <div>
                  <h2 className="font-serif text-xl font-bold text-purple-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{item.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-purple-100 bg-white p-5 text-sm leading-relaxed text-charcoal/80">
          Historical accounts of the former government dispensary and the TIWA maternity centre document
          the community&rsquo;s healthcare evolution through the twentieth century.
        </div>

        <div className="mt-8 text-sm">
          <Link href="/education" className="font-semibold text-community-green hover:underline">
            See the linked history of education and mission work →
          </Link>
        </div>
      </Container>
    </div>
  );
}
