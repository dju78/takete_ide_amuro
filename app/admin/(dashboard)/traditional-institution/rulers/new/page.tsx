import { RulerForm } from "@/components/admin/RulerForm";
import { createRulerAction } from "@/lib/actions/admin-traditional-institution";

export const metadata = { title: "New Ruler — Admin" };

export default function NewRulerPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Ruler</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <RulerForm action={createRulerAction} />
      </div>
    </div>
  );
}
