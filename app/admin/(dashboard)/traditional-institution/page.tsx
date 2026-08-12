import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { VerificationBadge } from "@/components/ui/Badge";

export const metadata = { title: "Traditional Leaders — Admin" };

export default async function AdminTraditionalInstitutionPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("traditional_rulers").select("id, full_name, is_current, verification_status").order("sort_order")
    : { data: [] };

  return (
    <SimpleAdminTable
      title="Traditional Leaders"
      description="Rulers' names and reign dates must be confirmed by the traditional council before being marked Verified. Manage via Supabase Studio (traditional_rulers, traditional_council_members) for now."
      rows={data ?? []}
      columns={[
        { header: "Name", render: (r) => r.full_name },
        { header: "Current", render: (r) => (r.is_current ? "Yes" : "No") },
        { header: "Verification", render: (r) => <VerificationBadge status={r.verification_status} /> },
      ]}
      emptyMessage="No rulers recorded yet."
    />
  );
}
