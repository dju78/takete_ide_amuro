import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { resetBranchAction } from "@/lib/actions/admin-tipu-branches";
import { findBranchSeed, GROUP_LABELS } from "@/lib/media/tipu-branches";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = { title: "TIPU Branches — Admin" };

export default async function AdminBranchesPage() {
  const branches = await getBranchNetwork({ includeInactive: true });
  const missingPhotos = branches.filter((b) => b.needsPlaceholder).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-purple-600">TIPU Branches</h1>
        <Link
          href="/admin/tipu/branches/new"
          className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add Branch
        </Link>
      </div>

      <p className="mt-2 max-w-3xl text-sm text-charcoal/70">
        Every documented branch appears on the public network page whether or not it has a photograph —
        those without one show the union&rsquo;s branded placeholder. {missingPhotos} of {branches.length}{" "}
        branches are currently waiting for a photograph; uploading one from the branch&rsquo;s edit page
        replaces the placeholder immediately, with no deploy.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Media</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.slug} className="border-b border-purple-600/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-purple-700 text-xs font-bold text-gold-300">
                      {branch.image ? (
                        <Image src={branch.image} alt="" fill sizes="44px" className="object-cover" />
                      ) : (
                        branch.acronym
                      )}
                    </span>
                    <span>
                      <span className="block font-medium text-charcoal">{branch.name}</span>
                      <span className="block text-xs text-charcoal/50">
                        {branch.location || branch.slug}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-charcoal/70">{GROUP_LABELS[branch.group].title}</td>
                <td className="px-4 py-3">
                  {branch.needsPlaceholder ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                      <ImageOff className="h-3.5 w-3.5" aria-hidden="true" /> Placeholder
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-600/10 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                      Photograph
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        branch.status === "active"
                          ? "bg-green-600/10 text-green-700"
                          : branch.status === "forming"
                            ? "bg-gold-100 text-gold-700"
                            : "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {branch.status === "active" ? "Active" : branch.status === "forming" ? "Forming" : "Inactive"}
                    </span>
                    {branch.verification === "pending-verification" && (
                      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
                        Needs verification
                      </span>
                    )}
                    {branch.featured && (
                      <span className="inline-flex rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                        Homepage
                      </span>
                    )}
                    {branch.href && (
                      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-600">
                        Has page
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/tipu/branches/${branch.slug}/edit`}
                    className="mr-3 font-medium text-purple-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={resetBranchAction.bind(null, branch.slug)}
                    label={findBranchSeed(branch.slug) ? "branch's edits (reset)" : "branch"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        Resetting a branch that ships with the site restores the details it was published with — it does
        not remove the branch. Only branches added here can be deleted outright.
      </p>
    </div>
  );
}
