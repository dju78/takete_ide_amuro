import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/NewsForm";
import { updateNewsAction } from "@/lib/actions/admin-news";
import { getNewsFormOptions } from "@/lib/data/news-options";
import { StatusBadge } from "@/components/ui/Badge";

export const metadata = { title: "Edit Article — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();

  const [{ data: article }, options] = await Promise.all([
    supabase.from("news_articles").select("*").eq("id", id).maybeSingle(),
    getNewsFormOptions(),
  ]);
  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/news" className="text-sm font-medium text-purple-600 hover:underline">
        ← Back to News
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Article</h1>
        <StatusBadge status={article.status} />
        {article.status === "published" && (
          <Link
            href={`/news/${article.slug}`}
            className="text-sm font-medium text-community-green hover:underline"
          >
            View on the site →
          </Link>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <NewsForm
          action={updateNewsAction.bind(null, id)}
          categories={options.categories}
          branches={options.branches}
          projects={options.projects}
          defaultValues={article}
        />
      </div>
    </div>
  );
}
