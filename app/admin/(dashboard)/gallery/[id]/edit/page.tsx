import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryItemForm } from "@/components/admin/GalleryItemForm";
import { updateGalleryItemAction } from "@/lib/actions/admin-gallery";
import { getAlbumOptions } from "@/lib/data/admin";

export const metadata = { title: "Edit Photograph — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditGalleryItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data }, albums] = await Promise.all([
    supabase.from("gallery_items").select("*").eq("id", id).maybeSingle(),
    getAlbumOptions(),
  ]);
  if (!data) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Photograph</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <GalleryItemForm action={updateGalleryItemAction.bind(null, id)} albums={albums} defaultValues={data} />
      </div>
    </div>
  );
}
