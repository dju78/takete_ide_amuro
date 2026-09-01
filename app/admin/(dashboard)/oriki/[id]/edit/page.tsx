import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrikiRecordForm } from "@/components/admin/OrikiRecordForm";
import { updateOrikiRecordAction } from "@/lib/actions/admin-oriki-records";
import { getOrikiRecordById } from "@/lib/data/oriki-records";

export const metadata: Metadata = {
  title: "Edit Oríkì Record — Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditOrikiRecordPage({ params }: Props) {
  const { id } = await params;
  const record = await getOrikiRecordById(id);
  if (!record) notFound();

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
          <h1 className="font-serif text-2xl font-bold text-purple-950">
            Edit Oríkì: {record.family_origin}
          </h1>
          <p className="mt-0.5 text-xs text-charcoal/70">
            Update praise names, display order, or publication status.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-purple-600/10 bg-white p-6 sm:p-8 shadow-xs">
        <OrikiRecordForm action={updateOrikiRecordAction.bind(null, id)} record={record} />
      </div>
    </div>
  );
}
