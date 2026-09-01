"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Sparkles, X, PlusCircle, ShieldCheck, BookOpen } from "lucide-react";
import type { OrikiRecord } from "@/lib/data/oriki-records";

interface Props {
  records: OrikiRecord[];
}

export function OrikiDirectory({ records }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.family_origin.toLowerCase().includes(q) ||
        r.male_oriki.toLowerCase().includes(q) ||
        r.female_oriki.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
    );
  }, [records, search]);

  return (
    <div className="space-y-8">
      {/* Search and stats bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="oriki-search" className="sr-only">
            Search Oríkì records
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            id="oriki-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search family name or Oríkì..."
            className="w-full rounded-full border border-purple-600/20 bg-white py-2.5 pl-10 pr-10 text-sm placeholder:text-charcoal/40 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal/70">
          <span className="rounded-full bg-purple-100/70 px-3 py-1 font-semibold text-purple-900">
            {filtered.length} {filtered.length === 1 ? "Record" : "Records"}
          </span>
          <Link
            href="/oriki/contribute"
            className="inline-flex items-center gap-1.5 font-medium text-purple-700 hover:text-purple-900 hover:underline"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Submit correction / new Oríkì
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-purple-400" />
          <h3 className="mt-3 font-serif text-lg font-bold text-purple-950">No matching Oríkì found</h3>
          <p className="mt-1 text-sm text-charcoal/70">
            No family or praise name matches &ldquo;{search}&rdquo;.
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-4 inline-flex items-center rounded-full bg-purple-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-800"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-3xl border border-purple-600/10 bg-white shadow-xs md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Takete-Ide Family Oríkì Directory">
                <thead>
                  <tr className="border-b border-purple-100 bg-purple-50/70 text-xs font-semibold uppercase tracking-wider text-purple-950">
                    <th scope="col" className="w-16 py-4 pl-6 pr-3">
                      #
                    </th>
                    <th scope="col" className="py-4 px-4">
                      Family/origin
                    </th>
                    <th scope="col" className="py-4 px-4">
                      Male Oríkì
                    </th>
                    <th scope="col" className="py-4 pr-6 pl-4">
                      Female Oríkì
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 text-charcoal/90">
                  {filtered.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-purple-50/40 transition-colors"
                    >
                      <td className="py-4 pl-6 pr-3 font-mono text-xs font-bold text-gold-700">
                        {record.display_order || index + 1}
                      </td>
                      <td className="py-4 px-4 font-serif font-bold text-purple-950 text-base">
                        {record.family_origin}
                        {record.notes && (
                          <span className="block text-xs font-normal text-charcoal/60 mt-0.5">
                            {record.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-900">
                          {record.male_oriki}
                        </span>
                      </td>
                      <td className="py-4 pr-6 pl-4">
                        <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-sm font-medium text-purple-900">
                          {record.female_oriki}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List (Horizontal-Overflow-Free) */}
          <div className="space-y-3 md:hidden">
            {filtered.map((record, index) => (
              <div
                key={record.id}
                className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-xs transition hover:border-purple-600/20"
              >
                <div className="flex items-center justify-between gap-2 border-b border-purple-50 pb-3">
                  <span className="font-mono text-xs font-bold text-gold-700">
                    #{record.display_order || index + 1}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-purple-950 text-right">
                    {record.family_origin}
                  </h3>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-indigo-50/60 p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Male Oríkì
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-indigo-950">
                      {record.male_oriki}
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50/60 p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Female Oríkì
                    </span>
                    <p className="mt-1 font-serif text-sm font-bold text-purple-950">
                      {record.female_oriki}
                    </p>
                  </div>
                </div>

                {record.notes && (
                  <p className="mt-3 text-xs text-charcoal/70 bg-purple-50/30 rounded-lg p-2">
                    {record.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Developing heritage notice banner */}
      <div className="rounded-3xl border border-gold-300 bg-gold-50/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 shrink-0 text-gold-700 mt-0.5" />
          <div>
            <h4 className="font-serif font-bold text-purple-950 text-base">
              Community Heritage Record
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-charcoal/80 leading-relaxed max-w-2xl">
              This is a developing community heritage record. Verified corrections and additional family Oríkì may be submitted for inclusion.
            </p>
          </div>
        </div>

        <Link
          href="/oriki/contribute"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-purple-800"
        >
          Submit Oríkì Record →
        </Link>
      </div>
    </div>
  );
}
