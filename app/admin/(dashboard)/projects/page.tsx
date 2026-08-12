import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { ProjectStatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Development Projects — Admin" };

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("projects").select("id, title, category, status").order("created_at", { ascending: false }) : { data: [] };

  return (
    <SimpleAdminTable
      title="Development Projects"
      description="Manage project records via Supabase Studio for now (projects, project_updates, project_images, project_documents, project_timeline_events tables). A full in-app project editor is a planned enhancement."
      rows={data ?? []}
      columns={[
        { header: "Title", render: (r) => r.title },
        { header: "Category", render: (r) => String(r.category).replace(/_/g, " ") },
        { header: "Status", render: (r) => <ProjectStatusBadge status={r.status} /> },
      ]}
      emptyMessage="No projects yet."
    />
  );
}
