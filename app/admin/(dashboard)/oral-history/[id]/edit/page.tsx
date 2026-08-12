import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OralHistoryForm } from "@/components/admin/OralHistoryForm";
import { updateOralHistoryAction } from "@/lib/actions/admin-oral-history";

export const metadata = { title: "Edit Oral History — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditOralHistoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("oral_histories").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Oral History</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <OralHistoryForm action={updateOralHistoryAction.bind(null, id)} defaultValues={data} />
      </div>
    </div>
  );
}
