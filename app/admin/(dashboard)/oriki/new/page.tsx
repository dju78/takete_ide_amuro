import { OrikiForm } from "@/components/admin/OrikiForm";
import { createOrikiAction } from "@/lib/actions/admin-oriki";
import { getFamilyOptions, getCompoundOptions } from "@/lib/data/admin";

export const metadata = { title: "New Oríkì — Admin" };

export default async function NewOrikiPage() {
  const [families, compounds] = await Promise.all([getFamilyOptions(), getCompoundOptions()]);
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Oríkì</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <OrikiForm action={createOrikiAction} families={families} compounds={compounds} />
      </div>
    </div>
  );
}
