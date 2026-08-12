import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VerificationBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { getArchiveItemBySlug } from "@/lib/data/archive";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getArchiveItemBySlug(slug);
  if (!item) return { title: "Archive item not found" };
  return { title: item.title, description: item.description ?? undefined };
}

export default async function ArchiveItemPage({ params }: Props) {
  const { slug } = await params;
  const item = await getArchiveItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="bg-ivory">
      <Container className="py-16">
        <Breadcrumb items={[{ label: "Digital Archive", href: "/archive" }, { label: item.title }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-purple-50">
            {(item.thumbnail_url || item.file_url) && (
              <Image src={item.thumbnail_url ?? item.file_url!} alt={item.title} fill className="object-contain" />
            )}
          </div>
          <div>
            <VerificationBadge status={item.verification_status} />
            <h1 className="mt-3 font-serif text-3xl font-bold text-purple-600">{item.title}</h1>
            <p className="mt-1 text-sm text-charcoal/50">
              {item.item_date ? `${item.is_approximate_date ? "c. " : ""}${formatDate(item.item_date)}` : "Date unknown"}
              {" · "}
              {item.category.replace(/_/g, " ")}
            </p>
            {item.description && <p className="prose-heritage mt-6 text-charcoal/85">{item.description}</p>}
            <dl className="mt-6 space-y-2 text-sm text-charcoal/70">
              {item.contributor && (
                <div><dt className="inline font-medium">Contributor: </dt><dd className="inline">{item.contributor}</dd></div>
              )}
              {item.rights_notes && (
                <div><dt className="inline font-medium">Rights: </dt><dd className="inline">{item.rights_notes}</dd></div>
              )}
            </dl>
            {item.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">#{tag}</span>
                ))}
              </div>
            )}
            {item.file_url && (
              <a href={item.file_url} className="mt-6 inline-block text-sm font-semibold text-community-green hover:underline">
                Open / Download Original →
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
