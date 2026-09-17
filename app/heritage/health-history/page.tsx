import type { Metadata } from "next";
import Link from "next/link";
import { HeartPulse, Stethoscope, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";
import { SourcedSection } from "@/components/heritage/SourcedSection";
import { siteConfig } from "@/lib/site-config";
import { BOOK_HEALTH_HISTORY } from "@/content/history/web/from-hilltops-to-valley-expanded";
import {
  BOOK_SOURCE_NOTE,
  BOOK_SOURCE_TITLE,
} from "@/content/history/web/from-hilltops-to-valley";

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
        <ResearchDisclaimer />

        <div className="mt-12">
          <SourcedSection
            title="From indigenous healing to modern community health services"
            status="documentary_evidence"
            sourceNote={`${BOOK_SOURCE_TITLE}, Chapter Seven. ${BOOK_SOURCE_NOTE}`}
          >
            <p>
              The manuscript treats healthcare as an important part of Takete-Ide’s twentieth-century social
              transformation. It records older indigenous approaches alongside the arrival of missionary medicine
              and the gradual development of resident health workers and facilities.
            </p>
            <p>
              This page is historical. It does not provide medical advice or describe the present operating status
              of any facility unless that information is separately verified.
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

        <div className="mt-10 rounded-2xl border border-gold-500/25 bg-gold-50 p-5 text-sm leading-relaxed text-charcoal/80">
          The manuscript’s description of the former government dispensary and the TIWA maternity centre reflects
          a historical point in time. For current healthcare availability, residents should use contemporary local
          health-service information.
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
