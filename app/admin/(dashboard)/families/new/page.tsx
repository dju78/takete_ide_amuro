import { FamilyForm } from "@/components/admin/FamilyForm";
import { createFamilyAction } from "@/lib/actions/admin-families";
import { getCompoundOptions } from "@/lib/data/admin";

export const metadata = { title: "New Family — Admin" };

export default async function NewFamilyPage() {
  const compounds = await getCompoundOptions();
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Family</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <FamilyForm action={createFamilyAction} compounds={compounds} />
      </div>
    </div>
  );
}
