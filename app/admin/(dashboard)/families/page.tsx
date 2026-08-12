import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Families & Oríkì — Admin" };

export default async function AdminFamiliesPage() {
  const supabase = await createClient();
  const [families, oriki] = await Promise.all([
    supabase ? supabase.from("families").select("id, name, status").order("name") : Promise.resolve({ data: [] }),
    supabase ? supabase.from("oriki").select("id, title, status").order("title") : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <SimpleAdminTable
        title="Families"
        description="Manage families, compounds, family_media, family_sources and family_relationships via Supabase Studio for now. See docs/HISTORICAL_VERIFICATION.md for the review workflow before publishing."
        rows={families.data ?? []}
        columns={[
          { header: "Family Name", render: (r) => r.name },
          { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        emptyMessage="No families recorded yet."
      />
      <SimpleAdminTable
        title="Oríkì"
        description="Manage the oriki table and its media/sources via Supabase Studio for now."
        rows={oriki.data ?? []}
        columns={[
          { header: "Title", render: (r) => r.title },
          { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
        ]}
        emptyMessage="No Oríkì recorded yet."
      />
    </div>
  );
}
