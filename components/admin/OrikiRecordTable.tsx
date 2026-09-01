"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { deleteOrikiRecordAction, togglePublishOrikiRecordAction } from "@/lib/actions/admin-oriki-records";
import type { OrikiRecord } from "@/lib/data/oriki-records";

interface Props {
  records: OrikiRecord[];
}

export function OrikiRecordTable({ records }: Props) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = records.filter(
    (r) =>
      r.family_origin.toLowerCase().includes(search.toLowerCase()) ||
      r.male_oriki.toLowerCase().includes(search.toLowerCase()) ||
      r.female_oriki.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, family: string) => {
    if (confirm(`Are you sure you want to delete the Oríkì record for "${family}"? This action cannot be undone.`)) {
      startTransition(async () => {
        await deleteOrikiRecordAction(id);
      });
    }
  };

  const handleTogglePublish = (id: string, current: boolean) => {
    startTransition(async () => {
      await togglePublishOrikiRecordAction(id, current);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full rounded-xl border border-purple-600/20 bg-white py-2 pl-9 pr-3 text-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          />
        </div>
        <p className="text-xs text-charcoal/60">
          Showing {filtered.length} of {records.length} records
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-purple-100 bg-purple-50/70 text-xs font-semibold uppercase text-purple-950">
              <tr>
                <th scope="col" className="w-12 py-3 pl-4 pr-2">#</th>
                <th scope="col" className="py-3 px-3">Family / Origin</th>
                <th scope="col" className="py-3 px-3">Male Oríkì</th>
                <th scope="col" className="py-3 px-3">Female Oríkì</th>
                <th scope="col" className="py-3 px-3">Status</th>
                <th scope="col" className="py-3 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover:bg-purple-50/40">
                  <td className="py-3 pl-4 pr-2 font-mono text-xs font-bold text-gold-700">
                    {r.display_order || i + 1}
                  </td>
                  <td className="py-3 px-3 font-semibold text-purple-950">
                    {r.family_origin}
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-900">
                      {r.male_oriki}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-900">
                      {r.female_oriki}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTogglePublish(r.id, r.published)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
                        r.published
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-charcoal/10 text-charcoal/70 hover:bg-charcoal/20"
                      }`}
                      title={r.published ? "Click to unpublish" : "Click to publish"}
                    >
                      {r.published ? (
                        <>
                          <Eye className="h-3 w-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 pr-4 pl-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/oriki/${r.id}/edit`}
                        className="rounded-lg p-1.5 text-charcoal/60 hover:bg-purple-50 hover:text-purple-700"
                        title="Edit record"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id, r.family_origin)}
                        disabled={isPending}
                        className="rounded-lg p-1.5 text-charcoal/60 hover:bg-red-50 hover:text-red-700"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
