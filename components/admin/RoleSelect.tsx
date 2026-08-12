"use client";

import { updateUserRoleAction } from "@/lib/actions/admin-users";

const roles = ["super_admin", "administrator", "editor", "historian", "project_manager", "media_manager"];

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  return (
    <form
      action={(formData) => updateUserRoleAction(userId, formData)}
      onChange={(e) => (e.currentTarget as HTMLFormElement).requestSubmit()}
    >
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-lg border border-purple-600/15 bg-white px-3 py-1.5 text-sm capitalize"
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
