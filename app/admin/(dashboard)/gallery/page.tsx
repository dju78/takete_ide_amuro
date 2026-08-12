import { createClient } from "@/lib/supabase/server";
import { SimpleAdminTable } from "@/components/admin/SimpleAdminTable";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Gallery — Admin" };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.from("gallery_items").select("id, title, category, status").order("created_at", { ascending: false }) : { data: [] };

  return (
    <SimpleAdminTable
      title="Gallery"
      description="Upload images to the `gallery` Storage bucket, then add rows to gallery_items via Supabase Studio. An in-app uploader is a planned enhancement — see docs/ADMIN_GUIDE.md."
      rows={data ?? []}
      columns={[
        { header: "Title", render: (r) => r.title ?? "Untitled" },
        { header: "Category", render: (r) => r.category },
        { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
      ]}
      emptyMessage="No gallery items yet."
    />
  );
}
