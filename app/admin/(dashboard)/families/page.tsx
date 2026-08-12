import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge, VerificationBadge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteFamilyAction } from "@/lib/actions/admin-families";
import { deleteOrikiAction } from "@/lib/actions/admin-oriki";

export const metadata = { title: "Families & Oríkì — Admin" };

export default async function AdminFamiliesPage() {
  const supabase = await createClient();
  const [families, oriki] = await Promise.all([
    supabase ? supabase.from("families").select("id, name, status, verification_status").order("name") : Promise.resolve({ data: [] }),
    supabase ? supabase.from("oriki").select("id, title, status, verification_status, consent_confirmed").order("title") : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-purple-600">Families</h1>
            <p className="mt-1 text-sm text-charcoal/60">See docs/HISTORICAL_VERIFICATION.md for the review workflow before publishing.</p>
          </div>
          <Link href="/admin/families/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Family
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(families.data ?? []).map((f) => (
                <tr key={f.id} className="border-b border-purple-600/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">{f.name}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                  <td className="px-4 py-3"><VerificationBadge status={f.verification_status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/families/${f.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">Edit</Link>
                    <DeleteButton action={deleteFamilyAction.bind(null, f.id)} label="family" />
                  </td>
                </tr>
              ))}
              {(!families.data || families.data.length === 0) && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-charcoal/50">No families recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-purple-600">Oríkì</h2>
            <p className="mt-1 text-sm text-charcoal/60">Original wording, transliteration, interpretation, audio/video, consent and verification.</p>
          </div>
          <Link href="/admin/oriki/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
            <Plus className="h-4 w-4" aria-hidden="true" /> New Oríkì
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3">Consent</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(oriki.data ?? []).map((o) => (
                <tr key={o.id} className="border-b border-purple-600/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">{o.title}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3"><VerificationBadge status={o.verification_status} /></td>
                  <td className="px-4 py-3">{o.consent_confirmed ? "✓" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/oriki/${o.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">Edit</Link>
                    <DeleteButton action={deleteOrikiAction.bind(null, o.id)} label="Oríkì" />
                  </td>
                </tr>
              ))}
              {(!oriki.data || oriki.data.length === 0) && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-charcoal/50">No Oríkì recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
