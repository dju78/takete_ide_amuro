import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VerificationBadge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/utils";
import { getArchiveItemBySlug, getArchiveItems } from "@/lib/data/archive";
import { ArchiveDocumentCover } from "@/components/archive/ArchiveDocumentCover";
import {
  ARCHIVE_OVERVIEW_CARDS,
  ILETEJU_TRANSITION,
  RELATED_HERITAGE_LINKS,
} from "@/content/history/web/archive-overview";
import { MIGRATION_TIMELINE } from "@/content/history/web/migration-timeline";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await getArchiveItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArchiveItemBySlug(slug);
  if (!item) return { title: "Archive item not found" };

  if (slug === "takete-history-original") {
    return {
      title: "Takete-Ide Historical Community Account | Digital Archive",
      description:
        "A preserved community historical account covering Takete-Ide, Amuro, migration traditions, landscape, cultural memory and the movement to the present settlement around 1926.",
    };
  }

  return { title: `${item.title} | Digital Archive`, description: item.description ?? undefined };
}

export default async function ArchiveItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getArchiveItemBySlug(slug);
  if (!item) notFound();

  const isCanonicalTaketeHistory = item.slug === "takete-history-original";

  return (
    <div className="bg-ivory">
      <Container className="py-14 sm:py-16">
        <Breadcrumb items={[{ label: "Digital Archive", href: "/archive" }, { label: item.title }]} />

        {/* Primary Archive Header Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden rounded-2xl">
            {item.thumbnail_url || item.file_url ? (
              <Image
                src={item.thumbnail_url ?? item.file_url!}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain bg-purple-50"
              />
            ) : (
              <ArchiveDocumentCover
                title={item.title}
                subtitle="Heritage • Migration • Landscape • Community Memory"
                category={item.category === "document" ? "Community Historical Account" : item.category}
              />
            )}
          </div>

          <div className="rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5">
              <VerificationBadge status={item.verification_status} />
              <span className="rounded-full bg-purple-50 px-3 py-0.5 text-xs font-semibold text-purple-700 capitalize">
                {item.category.replace(/_/g, " ")}
              </span>
            </div>

            <h1 className="mt-4 font-serif text-2xl font-bold text-purple-900 sm:text-3xl lg:text-4xl">
              {item.title}
            </h1>

            <p className="mt-2 text-xs font-medium text-charcoal/60">
              {item.item_date ? (
                <>
                  <span className="font-semibold text-charcoal/80">Document Date:</span>{" "}
                  {item.is_approximate_date ? "c. " : ""}
                  {formatDate(item.item_date)}
                </>
              ) : (
                <>
                  <span className="font-semibold text-charcoal/80">Date:</span> Not stated in supplied manuscript
                </>
              )}
            </p>

            {item.description && (
              <p className="mt-5 text-sm leading-relaxed text-charcoal/85 sm:text-base">
                {item.description}
              </p>
            )}

            <div className="mt-6 border-t border-purple-100 pt-5">
              <dl className="grid gap-3 text-xs sm:text-sm text-charcoal/75 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-purple-950">Source Type</dt>
                  <dd className="mt-0.5 text-charcoal/70">
                    {isCanonicalTaketeHistory
                      ? "Community historical account and oral-tradition compilation"
                      : item.category.replace(/_/g, " ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-purple-950">Author / Compiler</dt>
                  <dd className="mt-0.5 text-charcoal/70">{item.contributor ?? "Not stated in supplied copy"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-purple-950">Editorial Status</dt>
                  <dd className="mt-0.5 text-charcoal/70">
                    {item.rights_notes ??
                      "Preserved for community documentation and continuing historical verification."}
                  </dd>
                </div>
              </dl>
            </div>

            {item.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-purple-100 pt-4">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {item.file_url && (
              <div className="mt-6 pt-4">
                <a
                  href={item.file_url}
                  className="inline-flex min-h-6 items-center gap-1 text-sm font-semibold text-community-green hover:underline"
                >
                  Open / Download Original <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Special Canonical Takete History Overview */}
        {isCanonicalTaketeHistory && (
          <div className="mt-16 space-y-16">
            {/* Inside this Historical Account (6 cards) */}
            <section>
              <SectionHeading
                eyebrow="Account Contents"
                title="Inside this Historical Account"
                align="left"
                className="mx-0"
                description="Key narrative themes preserved in the canonical community historical manuscript."
              />
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ARCHIVE_OVERVIEW_CARDS.map((card, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-serif text-lg font-bold text-purple-900">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-charcoal/75">{card.summary}</p>
                    </div>
                    <div className="mt-5 border-t border-purple-50 pt-4">
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                      >
                        {card.linkLabel} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Migration Strip */}
            <section className="rounded-3xl border border-purple-600/10 bg-white p-7 sm:p-10 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-xs font-semibold text-gold-800">
                    <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                    Sequential Stages
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
                    Historical Migration Sequence
                  </h2>
                </div>
                <Link
                  href="/our-story#journey"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-community-green hover:underline"
                >
                  View full migration timeline →
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-5">
                {MIGRATION_TIMELINE.map((step, idx) => (
                  <div
                    key={step.id}
                    className="relative flex flex-col rounded-xl border border-purple-100 bg-purple-50/50 p-4"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                      Stage 0{idx + 1}
                    </span>
                    <h3 className="mt-1 font-serif text-sm font-bold text-purple-950">{step.place}</h3>
                    <p className="mt-1 text-[11px] text-charcoal/70 line-clamp-2">{step.period}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Ileteju to Takete-Idera Transition Feature */}
            <section className="overflow-hidden rounded-3xl border border-gold-500/30 bg-gradient-to-r from-gold-100/70 via-gold-50/50 to-purple-50/40 p-8 sm:p-10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/20 text-gold-800">
                  <Sparkles className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gold-800">
                    Settlement Naming
                  </span>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-purple-950">
                    {ILETEJU_TRANSITION.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/85 sm:text-base">
                    {ILETEJU_TRANSITION.body}
                  </p>
                  <p className="mt-3 text-xs italic text-charcoal/60">
                    {ILETEJU_TRANSITION.note}
                  </p>
                </div>
              </div>
            </section>

            {/* Related Heritage Navigation */}
            <section>
              <SectionHeading
                eyebrow="Connections"
                title="Related Heritage &amp; Public Pages"
                align="left"
                className="mx-0"
                description="Explore verified community pages and deep historical documentation connected to this account."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {RELATED_HERITAGE_LINKS.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group flex flex-col justify-between rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-all hover:border-purple-600/30 hover:shadow-md"
                  >
                    <div>
                      <h3 className="font-serif text-base font-bold text-purple-900 group-hover:text-purple-700">
                        {link.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-charcoal/70">
                        {link.description}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-community-green">
                      Explore page <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </Container>
    </div>
  );
}
