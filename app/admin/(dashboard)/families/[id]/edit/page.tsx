import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FamilyForm } from "@/components/admin/FamilyForm";
import { updateFamilyAction } from "@/lib/actions/admin-families";
import { getCompoundOptions } from "@/lib/data/admin";

export const metadata = { title: "Edit Family — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFamilyPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data: family }, compounds] = await Promise.all([
    supabase.from("families").select("*").eq("id", id).maybeSingle(),
    getCompoundOptions(),
  ]);
  if (!family) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Family</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <FamilyForm action={updateFamilyAction.bind(null, id)} compounds={compounds} defaultValues={family} />
      </div>
    </div>
  );
}
