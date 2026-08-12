import { ArchiveItemForm } from "@/components/admin/ArchiveItemForm";
import { createArchiveItemAction } from "@/lib/actions/admin-archive";

export const metadata = { title: "New Archive Item — Admin" };

export default function NewArchiveItemPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Archive Item</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <ArchiveItemForm action={createArchiveItemAction} />
      </div>
    </div>
  );
}
