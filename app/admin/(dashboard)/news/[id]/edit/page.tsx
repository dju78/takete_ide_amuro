import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/NewsForm";
import { updateNewsAction } from "@/lib/actions/admin-news";

export const metadata = { title: "Edit Article — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data: article } = await supabase.from("news_articles").select("*").eq("id", id).maybeSingle();
  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Article</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <NewsForm action={updateNewsAction.bind(null, id)} defaultValues={article} />
      </div>
    </div>
  );
}
