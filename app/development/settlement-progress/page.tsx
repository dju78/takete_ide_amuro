import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SettlementProgressGallery, type SettlementPhoto } from "@/components/development/SettlementProgressGallery";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Settlement & Community Progress | Takete-Ide Amuro",
  description:
    "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
  alternates: {
    canonical: `${siteConfig.url}/development/settlement-progress`,
  },
  openGraph: {
    title: "Settlement & Community Progress | Takete-Ide Amuro",
    description:
      "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
    url: `${siteConfig.url}/development/settlement-progress`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Settlement & Community Progress | Takete-Ide Amuro",
    description:
      "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
  },
};

export const revalidate = 3600;

// Section 1: Editorial selection (4 photographs)
const editorialPhotos: SettlementPhoto[] = [
  {
    id: "sp-01",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-01.jpg",
    title: "Contemporary residential building in Takete-Ide",
    alt: "Contemporary residential building with modern roofing and perimeter fencing in Takete-Ide",
    caption: "Contemporary residential construction in Takete-Ide, showcasing contemporary roofing styles and materials.",
  },
  {
    id: "sp-02",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-02.jpg",
    title: "Modern house within the Takete-Ide settlement",
    alt: "Modern single-storey residential home within the Takete-Ide settlement",
    caption: "Modern residential home within the community settlement.",
  },
  {
    id: "sp-03",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-03.jpg",
    title: "Residential development in Takete-Ide",
    alt: "Residential development surrounded by green landscape in Takete-Ide",
    caption: "Residential development situated within the surrounding community landscape.",
  },
  {
    id: "sp-04",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-04.jpg",
    title: "View of contemporary housing development in Takete-Ide",
    alt: "Contemporary residential home with paved frontage in Takete-Ide",
    caption: "Contemporary housing construction within Takete-Ide.",
  },
];

// Section 2: Contemporary Residential Development (5 photographs)
const gridPhotos: SettlementPhoto[] = [
  {
    id: "sp-05",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-05.jpg",
    title: "Contemporary residential structure in Takete-Ide",
    alt: "Contemporary residential building in Takete-Ide",
    caption: "Residential building demonstrating updated construction techniques.",
  },
  {
    id: "sp-06",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-06.jpg",
    title: "Modern housing construction in Takete-Ide",
    alt: "Modern house with clean architectural lines in Takete-Ide",
    caption: "Modern housing structure in Takete-Ide.",
  },
  {
    id: "sp-07",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-07.jpg",
    title: "Residential building in Takete-Ide",
    alt: "Single-storey residential home in Takete-Ide",
    caption: "Residential home within the developing settlement.",
  },
  {
    id: "sp-08",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-08.jpg",
    title: "Contemporary home in Takete-Ide",
    alt: "Contemporary residential building with security gate in Takete-Ide",
    caption: "Contemporary home construction within the community.",
  },
  {
    id: "sp-09",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-09.jpg",
    title: "Modern residential architecture in Takete-Ide",
    alt: "Modern multi-room residential home in Takete-Ide",
    caption: "Modern residential development in Takete-Ide.",
  },
];

export default function SettlementProgressPage() {
  return (
    <div className="bg-ivory">
      {/* Hero Header */}
      <div className="bg-purple-700 py-14 text-white sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Development", href: "/development" },
              { label: "Settlement & Community Progress" },
            ]}
          />
          <div className="mt-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="h-6 w-6 text-gold-300" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                Built Environment &amp; Growth
              </p>
              <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">
                Settlement &amp; Community Progress
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                Takete-Ide continues to evolve as its physical settlement develops. New residential
                buildings, improved building materials and changing housing styles can be seen across
                different parts of the community.
              </p>
              <p className="mt-2 max-w-3xl text-xs leading-relaxed text-white/80 sm:text-sm">
                This photographic record documents aspects of the changing built environment and
                provides a visual account of contemporary settlement development in Takete-Ide.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="max-w-6xl py-12 sm:py-16">
        {/* SECTION 1 & 2: Interactive Settlement Progress Gallery */}
        <SettlementProgressGallery
          editorialPhotos={editorialPhotos}
          gridPhotos={gridPhotos}
        />

        {/* SECTION 3: Preserving a Record of Change */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-purple-600/10 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-800">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Digital Archive Context
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
                Documenting Community Change
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/80 sm:text-base">
                Recording the physical development of Takete-Ide helps preserve evidence of how the
                community changes over time. These photographs form part of the wider digital record of
                the town&rsquo;s landscape, institutions, heritage and development.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-charcoal/70 sm:text-sm">
                Explore connected sections of the platform to learn more about Takete-Ide&rsquo;s migration
                history, natural landmarks, civic projects and community archives.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col shrink-0">
              <Link
                href="/development"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-800"
              >
                Development Projects <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-2.5 text-xs font-semibold text-purple-900 shadow-xs transition hover:bg-purple-50"
              >
                Community Gallery <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/archive"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-5 py-2.5 text-xs font-semibold text-purple-900 shadow-xs transition hover:bg-purple-50"
              >
                Digital Archive <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
