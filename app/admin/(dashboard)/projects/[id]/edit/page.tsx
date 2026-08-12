import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AddProjectUpdateForm } from "@/components/admin/AddProjectUpdateForm";
import { updateProjectAction } from "@/lib/actions/admin-projects";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Edit Project — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data: project }, { data: images }, { data: updates }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).maybeSingle(),
    supabase.from("project_images").select("image_url").eq("project_id", id).order("sort_order").limit(1),
    supabase.from("project_updates").select("id, title, body, update_date").eq("project_id", id).order("update_date", { ascending: false }),
  ]);
  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Project</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <ProjectForm action={updateProjectAction.bind(null, id)} defaultValues={project} defaultImageUrl={images?.[0]?.image_url} />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-bold text-purple-600">Progress Updates</h2>
        <div className="mt-4 space-y-3">
          {(updates ?? []).map((u) => (
            <div key={u.id} className="rounded-xl border border-purple-600/10 bg-white p-4 text-sm">
              <p className="font-semibold text-purple-600">{u.title}</p>
              <p className="text-xs text-charcoal/50">{formatDate(u.update_date)}</p>
              {u.body && <p className="mt-1 text-charcoal/70">{u.body}</p>}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <AddProjectUpdateForm projectId={id} />
        </div>
      </div>
    </div>
  );
}
