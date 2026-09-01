import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Music4, ExternalLink } from "lucide-react";
import { OrikiRecordTable } from "@/components/admin/OrikiRecordTable";
import { getOrikiRecords } from "@/lib/data/oriki-records";

export const metadata: Metadata = {
  title: "Family Oríkì Records — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminOrikiPage() {
  const records = await getOrikiRecords({ publishedOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-purple-950 sm:text-3xl">
              Family Oríkì Records
            </h1>
            <a
              href="/oriki"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100"
            >
              Public Page <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="mt-1 text-sm text-charcoal/70">
            Manage the consolidated community directory of Takete-Ide family praise names for men and women.
          </p>
        </div>

        <Link
          href="/admin/oriki/new"
          className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-800 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Oríkì Record
        </Link>
      </div>

      <OrikiRecordTable records={records} />
    </div>
  );
}
