import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Audit Log — Admin" };

export default async function AdminAuditLogPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("audit_logs").select("id, action, entity_type, entity_id, created_at").order("created_at", { ascending: false }).limit(100)
    : { data: [] };

  return (
    <SimpleAdminTable
      title="Audit Log"
      description="Record of administrative actions: publishing, edits, deletions, verification and role changes."
      rows={data ?? []}
      columns={[
        { header: "Action", render: (r) => <span className="capitalize">{r.action.replace(/_/g, " ")}</span> },
        { header: "Entity", render: (r) => r.entity_type.replace(/_/g, " ") },
        { header: "When", render: (r) => formatDate(r.created_at, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
      ]}
      emptyMessage="No activity recorded yet."
    />
  );
}
