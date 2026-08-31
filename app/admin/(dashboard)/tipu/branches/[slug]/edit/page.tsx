import { notFound } from "next/navigation";
import Link from "next/link";
import { getBranch, getBranchUpdates } from "@/lib/data/tipu-branches";
import { BranchForm } from "@/components/admin/BranchForm";
import { BranchUpdateForm } from "@/components/admin/BranchUpdateForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateBranchAction, deleteBranchUpdateAction } from "@/lib/actions/admin-tipu-branches";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Edit Branch — Admin" };

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBranchPage({ params }: Props) {
  const { slug } = await params;
  const [branch, updates] = await Promise.all([getBranch(slug), getBranchUpdates()]);
  if (!branch) notFound();

  const branchUpdates = updates.get(slug) ?? [];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/tipu/branches" className="text-sm font-medium text-purple-600 hover:underline">
        ← Back to TIPU Branches
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-bold text-purple-600">{branch.name}</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        <code className="text-xs">{branch.slug}</code>
        {branch.needsPlaceholder && " · currently showing the branded placeholder"}
      </p>

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <BranchForm branch={branch} action={updateBranchAction.bind(null, branch.slug)} />
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-bold text-purple-600">Branch news &amp; events</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          The branch card shows the most recent published news item as its latest activity, and the next
          future event as its upcoming event.
        </p>
        <div className="mt-4">
          <BranchUpdateForm branchSlug={branch.slug} />
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {branchUpdates.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-purple-600/10 bg-white p-3 text-sm"
            >
              <span>
                <span className="mr-2 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-600">
                  {u.kind === "event" ? "Event" : "News"}
                </span>
                <strong>{u.title}</strong>
                {u.occurs_on && <span className="text-charcoal/60"> — {formatDate(u.occurs_on)}</span>}
              </span>
              <DeleteButton action={deleteBranchUpdateAction.bind(null, u.id)} label="entry" />
            </li>
          ))}
          {branchUpdates.length === 0 && (
            <p className="text-sm text-charcoal/50">
              Nothing recorded yet for this branch.
              {branch.latestActivity && " Its card currently shows the activity noted in the branch record."}
            </p>
          )}
        </ul>
      </section>
    </div>
  );
}
