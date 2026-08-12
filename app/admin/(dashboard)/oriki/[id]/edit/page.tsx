import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrikiForm } from "@/components/admin/OrikiForm";
import { updateOrikiAction } from "@/lib/actions/admin-oriki";
import { getFamilyOptions, getCompoundOptions } from "@/lib/data/admin";

export const metadata = { title: "Edit Oríkì — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditOrikiPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data: oriki }, { data: media }, families, compounds] = await Promise.all([
    supabase.from("oriki").select("*").eq("id", id).maybeSingle(),
    supabase.from("oriki_media").select("media_type, url").eq("oriki_id", id),
    getFamilyOptions(),
    getCompoundOptions(),
  ]);
  if (!oriki) notFound();

  const audio = media?.find((m) => m.media_type === "audio")?.url;
  const video = media?.find((m) => m.media_type === "video")?.url;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Oríkì</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <OrikiForm
          action={updateOrikiAction.bind(null, id)}
          families={families}
          compounds={compounds}
          defaultValues={oriki}
          defaultAudioUrl={audio}
          defaultVideoUrl={video}
        />
      </div>
    </div>
  );
}
