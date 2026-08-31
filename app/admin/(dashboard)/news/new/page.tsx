import { NewsForm } from "@/components/admin/NewsForm";
import { createNewsAction } from "@/lib/actions/admin-news";
import { getNewsFormOptions } from "@/lib/data/news-options";

export const metadata = { title: "New Article — Admin" };

export default async function NewNewsPage() {
  const { categories, branches, projects } = await getNewsFormOptions();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Article</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Articles are invisible to visitors until their status is set to Published.
      </p>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <NewsForm
          action={createNewsAction}
          categories={categories}
          branches={branches}
          projects={projects}
        />
      </div>
    </div>
  );
}
