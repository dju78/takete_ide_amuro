import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Oral Histories — Admin" };

export default async function AdminOralHistoryPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("oral_histories").select("id, interviewee, interviewer, status").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <SimpleAdminTable
      title="Oral Histories"
      description="Manage oral_histories via Supabase Studio for now, ensuring consent is recorded before publishing."
      rows={data ?? []}
      columns={[
        { header: "Interviewee", render: (r) => r.interviewee },
        { header: "Interviewer", render: (r) => r.interviewer ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      emptyMessage="No oral history recordings yet."
    />
  );
}
