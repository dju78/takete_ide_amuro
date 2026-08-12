import { createClient } from "@/lib/supabase/server";
import { InboxStatusSelect } from "@/components/admin/InboxStatusSelect";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Diaspora Submissions — Admin" };

export default async function AdminDiasporaPage() {
  const supabase = await createClient();
  const { data: members } = supabase
    ? await supabase.from("diaspora_members").select("*").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Diaspora Submissions</h1>
      <p className="mt-1 text-sm text-charcoal/60">Private registrations — never published publicly.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Expertise</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((m) => (
              <tr key={m.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{m.full_name}<br /><span className="text-xs text-charcoal/50">{m.email}</span></td>
                <td className="px-4 py-3">{m.country}{m.city ? `, ${m.city}` : ""}</td>
                <td className="px-4 py-3">{m.area_of_expertise ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal/60">{formatDate(m.created_at)}</td>
                <td className="px-4 py-3">
                  <InboxStatusSelect table="diaspora_members" id={m.id} statusColumn="status" currentStatus={m.status} options={["pending", "confirmed", "archived"]} />
                </td>
              </tr>
            ))}
            {(!members || members.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-charcoal/50">No registrations yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
