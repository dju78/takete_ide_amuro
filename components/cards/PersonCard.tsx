import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { VerificationBadge } from "@/components/ui/Badge";
import type { HistoricalPerson } from "@/types/content";

export function PersonCard({ person }: { person: HistoricalPerson }) {
  return (
    <Link
      href={`/our-people/${person.slug}`}
      className="group flex flex-col items-center rounded-2xl border border-purple-600/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-purple-50">
        {person.photo_url ? (
          <Image src={person.photo_url} alt={person.name} fill sizes="96px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-purple-600/30">
            <User className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <h3 className="mt-4 font-serif text-lg font-bold text-purple-600 group-hover:text-purple-400">{person.name}</h3>
      {person.achievements && <p className="mt-1 line-clamp-2 text-sm text-charcoal/70">{person.achievements}</p>}
      <VerificationBadge status={person.verification_status} className="mt-3" />
    </Link>
  );
}
