import { NewsForm } from "@/components/admin/NewsForm";
import { createNewsAction } from "@/lib/actions/admin-news";

export const metadata = { title: "New Article — Admin" };

export default function NewNewsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Article</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <NewsForm action={createNewsAction} />
      </div>
    </div>
  );
}
