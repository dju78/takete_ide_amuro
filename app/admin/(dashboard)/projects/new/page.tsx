import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/lib/actions/admin-projects";

export const metadata = { title: "New Project — Admin" };

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Development Project</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
