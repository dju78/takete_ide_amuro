import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteNewsAction } from "@/lib/actions/admin-news";

export const metadata = { title: "News — Admin" };

export default async function AdminNewsListPage() {
  const supabase = await createClient();
  const { data: articles } = supabase
    ? await supabase.from("news_articles").select("id, title, slug, status, published_at, created_at").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-purple-600">News</h1>
        <Link href="/admin/news/new" className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400">
          <Plus className="h-4 w-4" aria-hidden="true" /> New Article
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3 font-medium text-charcoal">{a.title}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 text-charcoal/60">{formatDate(a.published_at ?? a.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/news/${a.id}/edit`} className="mr-3 font-medium text-purple-600 hover:underline">
                    Edit
                  </Link>
                  <DeleteButton action={deleteNewsAction.bind(null, a.id)} label="article" />
                </td>
              </tr>
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-charcoal/50">
                  No articles yet. Create the first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
