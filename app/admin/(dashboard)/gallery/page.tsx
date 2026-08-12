import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/Badge";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { QuickAddAlbum } from "@/components/admin/QuickAddAlbum";
import { deleteGalleryItemAction } from "@/lib/actions/admin-gallery";

export const metadata = { title: "Gallery — Admin" };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data } = supabase
    ? await supabase.from("gallery_items").select("id, title, category, status").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-purple-600">Gallery</h1>
        <Link href="/admin/gallery/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Photograph
        </Link>
      </div>

      <div className="mt-4">
        <QuickAddAlbum />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r) => (
              <tr key={r.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{r.title ?? "Untitled"}</td>
                <td className="px-4 py-3">{r.category}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/gallery/${r.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">Edit</Link>
                  <DeleteButton action={deleteGalleryItemAction.bind(null, r.id)} label="photograph" />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-charcoal/50">No gallery items yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
