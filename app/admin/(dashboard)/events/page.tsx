import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Takete-Ide Day Events — Admin" };

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("events").select("id, year, theme, status").order("year", { ascending: false }) : { data: [] };

  return (
    <SimpleAdminTable
      title="Takete-Ide Day Events"
      description="Create a new year's event directly in Supabase Studio using the events table for now — a full in-app event editor is the next planned enhancement (see docs/ADMIN_GUIDE.md)."
      rows={data ?? []}
      columns={[
        { header: "Year", render: (r) => r.year },
        { header: "Theme", render: (r) => r.theme ?? "—" },
        { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      emptyMessage="No events yet."
    />
  );
}
