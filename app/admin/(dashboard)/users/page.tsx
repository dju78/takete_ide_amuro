import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { RoleSelect } from "@/components/admin/RoleSelect";

export const metadata = { title: "Users & Roles — Admin" };

export default async function AdminUsersPage() {
  await requireStaff("super_admin");
  const supabase = await createClient();

  const { data: memberships } = supabase
    ? await supabase
        .from("app_memberships")
        .select("id, user_id, role, status, created_at, profiles(id, full_name)")
        .eq("app_key", "takete")
        .order("created_at")
    : { data: [] };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Users & Roles</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Role changes take effect immediately for Takete-Ide. Only Super Admins can manage roles.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(memberships ?? []).map((m) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const profile = m.profiles as any;
              const displayName = profile?.full_name ?? m.user_id;
              return (
                <tr key={m.id} className="border-b border-purple-600/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-charcoal">{displayName}</td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={m.user_id} currentRole={m.role} />
                  </td>
                  <td className="px-4 py-3 text-xs capitalize text-charcoal/60">{m.status}</td>
                </tr>
              );
            })}
            {(!memberships || memberships.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-charcoal/50">
                  No Takete staff memberships yet. See docs/ADMIN_GUIDE.md to assign the first administrator.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
