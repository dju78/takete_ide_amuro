import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { siteSearch, typeLabels } from "@/lib/data/search";
import { truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Takete-Ide Amuro's news, digital archive, people, events, development projects, families and Oríkì.",
};

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;
  const results = q ? await siteSearch(q) : [];
  const filtered = type ? results.filter((r) => r.type === type) : results;

  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Search" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Search Takete-Ide</h1>
          <div className="mt-6 max-w-md">
            <SearchInput placeholder="Search news, archive, people, families…" basePath="/search" defaultValue={q} />
          </div>
        </Container>
      </div>

      <Container className="py-16">
        {!q ? (
          <EmptyState
            icon={SearchX}
            title="Start typing to search"
            message="Search across news, the digital archive, people, Takete-Ide Day, development projects, families and Oríkì."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`No results for "${q}"`}
            message="Try a different spelling, or browse the site sections directly from the navigation."
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Link href={`/search?q=${encodeURIComponent(q)}`} className={`rounded-full px-4 py-2 text-sm font-medium ${!type ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"}`}>
                All ({results.length})
              </Link>
              {Object.entries(counts).map(([t, count]) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(q)}&type=${t}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${type === t ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"}`}
                >
                  {typeLabels[t as keyof typeof typeLabels]} ({count})
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4">
              {filtered.map((r) => (
                <Link key={`${r.type}-${r.id}`} href={r.href} className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold-700">{typeLabels[r.type]}</span>
                  <h2 className="mt-1 font-serif text-lg font-bold text-purple-600">{r.title}</h2>
                  {r.excerpt && <p className="mt-1 text-sm text-charcoal/70">{truncate(r.excerpt, 160)}</p>}
                </Link>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
