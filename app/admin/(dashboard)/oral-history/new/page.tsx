import { OralHistoryForm } from "@/components/admin/OralHistoryForm";
import { createOralHistoryAction } from "@/lib/actions/admin-oral-history";

export const metadata = { title: "New Oral History — Admin" };

export default function NewOralHistoryPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Oral History</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <OralHistoryForm action={createOralHistoryAction} />
      </div>
    </div>
  );
}
