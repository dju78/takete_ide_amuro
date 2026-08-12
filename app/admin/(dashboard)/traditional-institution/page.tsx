import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { QuickAddCouncilMember } from "@/components/admin/QuickAddCouncilMember";
import { deleteRulerAction, deleteCouncilMemberAction } from "@/lib/actions/admin-traditional-institution";

export const metadata = { title: "Traditional Institution — Admin" };

export default async function AdminTraditionalInstitutionPage() {
  const supabase = await createClient();
  const [rulers, council] = await Promise.all([
    supabase ? supabase.from("traditional_rulers").select("id, full_name, is_current, verification_status").order("sort_order") : Promise.resolve({ data: [] }),
    supabase ? supabase.from("traditional_council_members").select("id, full_name, title").order("sort_order") : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-purple-600">Traditional Rulers</h1>
            <p className="mt-1 text-sm text-charcoal/60">Names and reign dates must be confirmed by the traditional council before verification.</p>
          </div>
          <Link href="/admin/traditional-institution/rulers/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Ruler
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Current</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(rulers.data ?? []).map((r) => (
                <tr key={r.id} className="border-b border-purple-600/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">{r.full_name}</td>
                  <td className="px-4 py-3">{r.is_current ? "Yes" : "No"}</td>
                  <td className="px-4 py-3"><VerificationBadge status={r.verification_status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/traditional-institution/rulers/${r.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">Edit</Link>
                    <DeleteButton action={deleteRulerAction.bind(null, r.id)} label="ruler" />
                  </td>
                </tr>
              ))}
              {(!rulers.data || rulers.data.length === 0) && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-charcoal/50">No rulers recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-purple-600">Traditional Council</h2>
        <div className="mt-4">
          <QuickAddCouncilMember />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(council.data ?? []).map((c) => (
                <tr key={c.id} className="border-b border-purple-600/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">{c.full_name}</td>
                  <td className="px-4 py-3">{c.title}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton action={deleteCouncilMemberAction.bind(null, c.id)} label="member" />
                  </td>
                </tr>
              ))}
              {(!council.data || council.data.length === 0) && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-charcoal/50">No council members listed yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
