import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PersonForm } from "@/components/admin/PersonForm";
import { updatePersonAction } from "@/lib/actions/admin-people";

export const metadata = { title: "Edit Profile — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPersonPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("historical_people").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Community Profile</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <PersonForm action={updatePersonAction.bind(null, id)} defaultValues={data} />
      </div>
    </div>
  );
}
