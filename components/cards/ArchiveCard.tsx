import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { VerificationBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { ArchiveItem } from "@/types/content";

export function ArchiveCard({ item }: { item: ArchiveItem }) {
  return (
    <Link
      href={`/archive/${item.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-purple-600/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-purple-50">
        {item.thumbnail_url ? (
          <Image src={item.thumbnail_url} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-purple-600/30">
            <FileText className="h-8 w-8" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-base font-bold text-purple-600 group-hover:text-purple-400">{item.title}</h3>
        <p className="mt-1 text-xs text-charcoal/50">
          {item.item_date ? `${item.is_approximate_date ? "c. " : ""}${formatDate(item.item_date)}` : "Date unknown"}
        </p>
        <VerificationBadge status={item.verification_status} className="mt-2 self-start" />
      </div>
    </Link>
  );
}
