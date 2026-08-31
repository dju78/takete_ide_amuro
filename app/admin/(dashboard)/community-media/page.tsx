import Link from "next/link";
import Image from "next/image";
import { Film } from "lucide-react";
import { getCommunityMedia } from "@/lib/data/community-media";
import { resetCommunityMediaAction } from "@/lib/actions/admin-community-media";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = { title: "Community Media — Admin" };

export default async function AdminCommunityMediaPage() {
  const items = await getCommunityMedia({ includeUnpublished: true });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Community Media</h1>
      <p className="mt-2 max-w-3xl text-sm text-charcoal/70">
        Photographs and video imported from the community archive. The files themselves ship with the
        website, so they can&rsquo;t go missing — but every caption, category, date, location and
        publication state below is editable here and takes effect immediately, with no deploy. Use{" "}
        <span className="font-medium">Reset</span> to discard your edits to an item and return it to the
        metadata it was imported with.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-purple-50">
                      {item.mediaType === "image" || item.poster ? (
                        <Image
                          src={item.mediaType === "image" ? item.src : item.poster!}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-purple-600/50">
                          <Film className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </span>
                    <span>
                      <span className="block font-medium text-charcoal">{item.title}</span>
                      <span className="block text-xs text-charcoal/50">
                        {item.mediaType === "video" ? "Video" : "Photograph"} · {item.id}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal/80">{item.category}</td>
                <td className="px-4 py-3 text-charcoal/60">{item.event ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.published ? "bg-green-600/10 text-green-700" : "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {item.published ? "Published" : "Hidden"}
                    </span>
                    {item.featured && (
                      <span className="inline-flex rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                        Featured
                      </span>
                    )}
                    {item.verificationStatus === "pending-verification" && (
                      <span className="inline-flex rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                        Pending verification
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/community-media/${item.id}/edit`}
                    className="mr-3 font-medium text-purple-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={resetCommunityMediaAction.bind(null, item.id)} label="item's edits (reset)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
