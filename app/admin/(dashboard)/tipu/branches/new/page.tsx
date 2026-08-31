import Link from "next/link";
import { BranchForm } from "@/components/admin/BranchForm";
import { createBranchAction } from "@/lib/actions/admin-tipu-branches";

export const metadata = { title: "Add Branch — Admin" };

export default function NewBranchPage() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/tipu/branches" className="text-sm font-medium text-purple-600 hover:underline">
        ← Back to TIPU Branches
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-bold text-purple-600">Add a Branch</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Only add a branch the community has actually documented. A branch with no photograph is fine — it
        will show the union&rsquo;s branded placeholder until one is supplied.
      </p>

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <BranchForm action={createBranchAction} submitLabel="Add branch" />
      </div>
    </div>
  );
}
