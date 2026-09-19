import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SchoolForm } from "@/components/admin/SchoolForm";
import { updateSchoolAction } from "@/lib/actions/admin-schools";

export const metadata = { title: "Edit School — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSchoolPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const { data: school } = await supabase.from("schools").select("*").eq("id", id).maybeSingle();
  if (!school) notFound();

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600 mb-6">Edit School: {school.name}</h1>
      <div className="rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm">
        <SchoolForm action={updateSchoolAction.bind(null, id)} defaultValues={school} />
      </div>
    </div>
  );
}
