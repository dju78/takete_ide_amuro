import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, VerificationBadge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteOralHistoryAction } from "@/lib/actions/admin-oral-history";

export const metadata = { title: "Oral Histories — Admin" };

export default async function AdminOralHistoryPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("oral_histories").select("id, interviewee, interviewer, status, verification_status, consent_confirmed").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-purple-600">Oral Histories</h1>
          <p className="mt-1 text-sm text-charcoal/60">Voices of Takete-Ide — consent is required before a recording can be saved.</p>
        </div>
        <Link href="/admin/oral-history/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
          <Plus className="h-4 w-4" aria-hidden="true" /> New Recording
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Interviewee</th>
              <th className="px-4 py-3">Interviewer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Consent</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{r.interviewee}</td>
                <td className="px-4 py-3">{r.interviewer ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3"><VerificationBadge status={r.verification_status} /></td>
                <td className="px-4 py-3">{r.consent_confirmed ? "✓" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/oral-history/${r.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">Edit</Link>
                  <DeleteButton action={deleteOralHistoryAction.bind(null, r.id)} label="recording" />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-charcoal/50">No oral history recordings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
