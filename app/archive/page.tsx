import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArchiveCard } from "@/components/cards/ArchiveCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { IconCard } from "@/components/cards/IconCard";
import { Mic } from "lucide-react";
import { getArchiveItems } from "@/lib/data/archive";

export const metadata: Metadata = {
  title: "Digital Archive",
  description: "Historical photographs, documents, records and oral histories of Takete-Ide Amuro.",
};

const categories = [
  "photograph", "programme", "church_record", "school_record", "document", "constitution",
  "meeting_minutes", "oral_history", "map", "newspaper_report", "video", "audio", "biography", "publication",
];

interface Props {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ArchivePage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const items = await getArchiveItems({ category, search: q });

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Digital Archive" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Digital Archive</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Historical photographs, documents, records and testimony — Takete-Ide&rsquo;s growing historical
            record.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <IconCard
          icon={Mic}
          title="Voices of Takete-Ide"
          description="Oral history recordings from community elders and knowledge-holders."
          href="/archive/oral-history"
          tone="gold"
          className="mb-10"
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link href="/archive" className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white">All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/archive?category=${c}`} className="rounded-full bg-white px-4 py-2 text-xs font-medium text-charcoal/70 hover:bg-purple-50">
                {c.replace(/_/g, " ")}
              </Link>
            ))}
          </div>
          <SearchInput placeholder="Search the archive…" basePath="/archive" defaultValue={q} />
        </div>

        <SectionHeading eyebrow="Records" title="Archive Items" align="left" className="mx-0 mt-12" />
        <div className="mt-8">
          {items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <ArchiveCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Historical records are being prepared for publication"
              message="This archive will grow as historical photographs, documents and records are digitised and verified by the archive team."
            />
          )}
        </div>
      </Container>
    </div>
  );
}
