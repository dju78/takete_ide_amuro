import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RulerForm } from "@/components/admin/RulerForm";
import { updateRulerAction } from "@/lib/actions/admin-traditional-institution";

export const metadata = { title: "Edit Ruler — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditRulerPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("traditional_rulers").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Ruler</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <RulerForm action={updateRulerAction.bind(null, id)} defaultValues={data} />
      </div>
    </div>
  );
}
