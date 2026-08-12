import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge, VerificationBadge } from "@/components/ui/Badge";

export const metadata = { title: "Community Profiles — Admin" };

export default async function AdminPeoplePage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("historical_people").select("id, name, category, status, verification_status").order("name")
    : { data: [] };

  return (
    <SimpleAdminTable
      title="Community Profiles (Our People)"
      description="Approved nominations from Volunteers & Nominations should be turned into historical_people records via Supabase Studio for now."
      rows={data ?? []}
      columns={[
        { header: "Name", render: (r) => r.name },
        { header: "Category", render: (r) => String(r.category).replace(/_/g, " ") },
        { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        { header: "Verification", render: (r) => <VerificationBadge status={r.verification_status} /> },
      ]}
      emptyMessage="No profiles yet."
    />
  );
}
