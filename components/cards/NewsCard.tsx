import Image from "next/image";
import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import type { NewsArticle } from "@/types/content";

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] bg-purple-50">
        {article.featured_image ? (
          <Image
            src={article.featured_image}
            alt={article.featured_image_alt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-purple-600/30">
            <span className="font-serif text-sm">Takete-Ide Amuro</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {article.category && (
          <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-700">
            {article.category.name}
          </span>
        )}
        <h3 className="font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">{article.title}</h3>
        {article.published_at && (
          <time dateTime={article.published_at} className="mt-1 text-xs text-charcoal/50">
            {formatDate(article.published_at)}
          </time>
        )}
        {article.excerpt && <p className="mt-3 flex-1 text-[15px] text-charcoal/70">{truncate(article.excerpt, 120)}</p>}
        <span className="mt-4 text-sm font-semibold text-community-green">Read More →</span>
      </div>
    </Link>
  );
}
