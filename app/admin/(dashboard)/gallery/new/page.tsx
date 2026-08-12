import { GalleryItemForm } from "@/components/admin/GalleryItemForm";
import { createGalleryItemAction } from "@/lib/actions/admin-gallery";
import { getAlbumOptions } from "@/lib/data/admin";

export const metadata = { title: "New Photograph — Admin" };

export default async function NewGalleryItemPage() {
  const albums = await getAlbumOptions();
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Add Photograph</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <GalleryItemForm action={createGalleryItemAction} albums={albums} />
      </div>
    </div>
  );
}
