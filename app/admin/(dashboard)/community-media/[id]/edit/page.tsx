import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCommunityMediaItem } from "@/lib/data/community-media";
import { CommunityMediaForm } from "@/components/admin/CommunityMediaForm";
import { updateCommunityMediaAction } from "@/lib/actions/admin-community-media";

export const metadata = { title: "Edit Community Media — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCommunityMediaPage({ params }: Props) {
  const { id } = await params;
  const item = await getCommunityMediaItem(id);
  if (!item) notFound();

  const previewSrc = item.mediaType === "image" ? item.src : item.poster;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/community-media" className="text-sm font-medium text-purple-600 hover:underline">
        ← Back to Community Media
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-bold text-purple-600">{item.title}</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        {item.mediaType === "video" ? "Video" : "Photograph"} · <code className="text-xs">{item.src}</code>
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-start">
        {previewSrc && (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-purple-50">
            <Image src={previewSrc} alt="" fill sizes="160px" className="object-cover" />
          </div>
        )}
        <div className="rounded-2xl border border-purple-600/10 bg-purple-50/40 p-4 text-sm text-charcoal/75">
          <p>
            <span className="font-medium text-charcoal">Source:</span> {item.source}
          </p>
          <p className="mt-2">
            The media file itself is part of the website build and cannot be changed from here — to swap the
            file, replace it in <code className="text-xs">public/</code> and redeploy. Everything else on
            this page is editable and takes effect straight away.
          </p>
          <p className="mt-2">
            Only add names under <span className="font-medium text-charcoal">Verified names</span> once the
            community has confirmed who is pictured and agreed to publication.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <CommunityMediaForm item={item} action={updateCommunityMediaAction.bind(null, id)} />
      </div>
    </div>
  );
}
