import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrikiRecordForm } from "@/components/admin/OrikiRecordForm";
import { createOrikiRecordAction } from "@/lib/actions/admin-oriki-records";

export const metadata: Metadata = {
  title: "New Oríkì Record — Admin",
};

export default function NewOrikiRecordPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/oriki"
          className="rounded-lg p-1.5 text-charcoal/60 hover:bg-purple-50 hover:text-purple-700"
          aria-label="Back to Oríkì records"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-purple-950">Add Oríkì Record</h1>
          <p className="mt-0.5 text-xs text-charcoal/70">
            Add an authenticated family praise name record to the community collection.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-xs">
        <OrikiRecordForm action={createOrikiRecordAction} />
      </div>
    </div>
  );
}
