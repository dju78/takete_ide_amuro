import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteSchoolAction } from "@/lib/actions/admin-schools";

export const metadata = { title: "Schools & Educational Institutions — Admin" };

export default async function AdminSchoolsPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("schools").select("id, name, level, school_type, year_established, verification_status").order("display_order", { ascending: true })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-7 w-7 text-purple-600" aria-hidden="true" />
          <h1 className="font-serif text-2xl font-bold text-purple-600">Schools &amp; Institutions Directory</h1>
        </div>
        <Link
          href="/admin/schools/new"
          className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New School
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">School Name</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Est. Year</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-b border-purple-600/5 last:border-0 hover:bg-purple-50/50">
                <td className="px-4 py-3 font-medium text-charcoal">{r.name}</td>
                <td className="px-4 py-3 capitalize">{String(r.level).replace(/_/g, " ")}</td>
                <td className="px-4 py-3 capitalize">{r.school_type}</td>
                <td className="px-4 py-3">{r.year_established || "—"}</td>
                <td className="px-4 py-3"><VerificationBadge status={r.verification_status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/schools/${r.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton action={deleteSchoolAction.bind(null, r.id)} label="school" />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-charcoal/50">
                  No schools created in database yet (default verified directory is shown on the website).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
