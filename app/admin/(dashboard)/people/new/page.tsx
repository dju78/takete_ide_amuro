import { PersonForm } from "@/components/admin/PersonForm";
import { createPersonAction } from "@/lib/actions/admin-people";

export const metadata = { title: "New Profile — Admin" };

export default function NewPersonPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Community Profile</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <PersonForm action={createPersonAction} />
      </div>
    </div>
  );
}
