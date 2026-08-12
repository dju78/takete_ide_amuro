import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";

export const metadata = { title: "Documents & Media — Admin" };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const [documents, media] = await Promise.all([
    supabase ? supabase.from("documents").select("id, title, document_type").order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
    supabase ? supabase.from("media").select("id, media_type, caption").order("created_at", { ascending: false }).limit(50) : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <SimpleAdminTable
        title="Documents"
        description="Upload files to the `documents` Storage bucket, then add rows here via Supabase Studio."
        rows={documents.data ?? []}
        columns={[
          { header: "Title", render: (r) => r.title },
          { header: "Type", render: (r) => r.document_type ?? "—" },
        ]}
        emptyMessage="No documents yet."
      />
      <SimpleAdminTable
        title="Media Library (latest 50)"
        description="General media library backing the site's Storage buckets."
        rows={media.data ?? []}
        columns={[
          { header: "Type", render: (r) => r.media_type },
          { header: "Caption", render: (r) => r.caption ?? "—" },
        ]}
        emptyMessage="No media uploaded yet."
      />
    </div>
  );
}
