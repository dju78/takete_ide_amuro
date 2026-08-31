import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { siteSearch, groupResults, typeLabels, type SearchType } from "@/lib/data/search";
import { truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search Takete-Ide Amuro — news, events, TIPU branches, people, families, Oríkì, places, development and the digital archive.",
  // Query-string result pages have no value in an index and would dilute the
  // canonical section pages.
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type } = await searchParams;
  const results = q ? await siteSearch(q) : [];
  const activeType = type as SearchType | undefined;
  const filtered = activeType ? results.filter((r) => r.type === activeType) : results;
  const groups = groupResults(filtered);

  const counts = results.reduce<Partial<Record<SearchType, number>>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Search" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Search Takete-Ide</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            News, events, TIPU branches, people, families, Oríkì, places and the digital archive.
          </p>
          <div className="mt-6 max-w-md">
            <SearchInput
              placeholder="Try “Ilorin”, “centenary”, “Obasoro”…"
              basePath="/search"
              defaultValue={q}
            />
          </div>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {!q ? (
          <EmptyState
            icon={SearchX}
            title="Start typing to search"
            message="Search across the whole site — branches, news, events, people, families, Oríkì, places, development projects and the digital archive."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`No results for “${q}”`}
            message="Try a different spelling or a broader term, or browse the sections directly from the navigation."
          />
        ) : (
          <>
            <p className="text-sm text-charcoal/60">
              {results.length} {results.length === 1 ? "result" : "results"} for{" "}
              <span className="font-semibold text-charcoal">“{q}”</span>
            </p>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter results by section">
              <Link
                href={`/search?q=${encodeURIComponent(q)}`}
                className={`inline-flex min-h-9 items-center rounded-full px-4 py-2 text-sm font-medium ${
                  !activeType ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
                }`}
              >
                All ({results.length})
              </Link>
              {groupResults(results).map(({ type: t, items }) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(q)}&type=${t}`}
                  className={`inline-flex min-h-9 items-center rounded-full px-4 py-2 text-sm font-medium ${
                    activeType === t ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
                  }`}
                >
                  {typeLabels[t]} ({counts[t] ?? items.length})
                </Link>
              ))}
            </div>

            {/* Grouped rather than one flat list: "Ilorin" legitimately matches a
                branch, a festival and a photograph, and the grouping is what tells
                a visitor which one they wanted. */}
            <div className="mt-10 flex flex-col gap-10">
              {groups.map(({ type: t, items }) => (
                <section key={t}>
                  <h2 className="font-serif text-xl font-bold text-purple-600">
                    {typeLabels[t]}{" "}
                    <span className="text-sm font-medium text-charcoal/45">({items.length})</span>
                  </h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {items.map((r) => (
                      <li key={`${r.type}-${r.id}`}>
                        <Link
                          href={r.href}
                          className="block rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <span className="font-serif text-lg font-bold text-purple-600">{r.title}</span>
                          {r.meta && (
                            <span className="mt-0.5 block text-xs font-medium text-gold-700">{r.meta}</span>
                          )}
                          {r.excerpt && (
                            <span className="mt-1 block text-sm text-charcoal/70">{truncate(r.excerpt, 180)}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
