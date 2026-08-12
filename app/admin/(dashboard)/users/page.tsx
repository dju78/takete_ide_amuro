import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { RoleSelect } from "@/components/admin/RoleSelect";

export const metadata = { title: "Users & Roles — Admin" };

export default async function AdminUsersPage() {
  await requireStaff("super_admin");
  const supabase = await createClient();
  const { data: profiles } = supabase
    ? await supabase.from("profiles").select("id, full_name, role, created_at").order("created_at")
    : { data: [] };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Users & Roles</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Role changes take effect immediately. Only Super Admins can manage roles.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{p.full_name ?? p.id}</td>
                <td className="px-4 py-3">
                  <RoleSelect userId={p.id} currentRole={p.role} />
                </td>
              </tr>
            ))}
            {(!profiles || profiles.length === 0) && (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-charcoal/50">
                  No staff accounts yet. See docs/ADMIN_GUIDE.md to create the first administrator.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
