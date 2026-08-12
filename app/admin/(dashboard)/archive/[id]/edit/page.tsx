import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArchiveItemForm } from "@/components/admin/ArchiveItemForm";
import { updateArchiveItemAction } from "@/lib/actions/admin-archive";

export const metadata = { title: "Edit Archive Item — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArchiveItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("archive_items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Archive Item</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <ArchiveItemForm action={updateArchiveItemAction.bind(null, id)} defaultValues={data} />
      </div>
    </div>
  );
}
