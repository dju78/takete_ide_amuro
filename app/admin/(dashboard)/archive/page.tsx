import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge, VerificationBadge } from "@/components/ui/Badge";

export const metadata = { title: "Historical Archive — Admin" };

export default async function AdminArchivePage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("archive_items").select("id, title, category, status, verification_status").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <SimpleAdminTable
      title="Historical Archive"
      description="Manage archive_items, archive_sources and verification_records via Supabase Studio for now — see docs/HISTORICAL_VERIFICATION.md for the review workflow."
      rows={data ?? []}
      columns={[
        { header: "Title", render: (r) => r.title },
        { header: "Category", render: (r) => String(r.category).replace(/_/g, " ") },
        { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { header: "Verification", render: (r) => <VerificationBadge status={r.verification_status} /> },
      ]}
      emptyMessage="No archive items yet."
    />
  );
}
