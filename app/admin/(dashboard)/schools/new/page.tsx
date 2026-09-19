import { SchoolForm } from "@/components/admin/SchoolForm";
import { createSchoolAction } from "@/lib/actions/admin-schools";

export const metadata = { title: "New School — Admin" };

export default function NewSchoolPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600 mb-6">Add Educational Institution</h1>
      <div className="rounded-2xl border border-purple-600/10 bg-white p-6 shadow-sm">
        <SchoolForm action={createSchoolAction} />
      </div>
    </div>
  );
}
