import Link from "next/link";
import { Network } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBranchNetwork } from "@/lib/data/tipu-branches";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/ui/Badge";
import {
  AddTipuLeaderForm,
  AddTipuAnnouncementForm,
  AddTipuDocumentForm,
} from "@/components/admin/TipuQuickAddForms";
import {
  deleteTipuLeaderAction,
  deleteTipuAnnouncementAction,
  deleteTipuDocumentAction,
} from "@/lib/actions/admin-tipu";

export const metadata = { title: "TIPU — Admin" };

export default async function AdminTipuPage() {
  const supabase = await createClient();
  const [leadership, branches, announcements, documents] = await Promise.all([
    supabase ? supabase.from("tipu_leadership").select("id, full_name, position, branch").order("sort_order") : Promise.resolve({ data: [] }),
    getBranchNetwork({ includeInactive: true }),
    supabase ? supabase.from("tipu_announcements").select("id, title, status").order("published_at", { ascending: false }) : Promise.resolve({ data: [] }),
    supabase ? supabase.from("tipu_documents").select("id, title, document_type").order("published_at", { ascending: false }) : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Takete-Ide Progressive Union</h1>

      <section>
        <h2 className="font-serif text-xl font-bold text-purple-600">Leadership</h2>
        <div className="mt-3"><AddTipuLeaderForm /></div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {(leadership.data ?? []).map((l) => (
            <li key={l.id} className="flex items-center justify-between rounded-xl border border-purple-600/10 bg-white p-3 text-sm">
              <span><strong>{l.full_name}</strong> — {l.position}{l.branch && ` (${l.branch})`}</span>
              <DeleteButton action={deleteTipuLeaderAction.bind(null, l.id)} label="leader" />
            </li>
          ))}
          {(!leadership.data || leadership.data.length === 0) && <p className="text-sm text-charcoal/50">No leaders listed yet.</p>}
        </ul>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-bold text-purple-600">Branches</h2>
          <Link
            href="/admin/tipu/branches"
            className="flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-400"
          >
            <Network className="h-4 w-4" aria-hidden="true" /> Manage the branch network
          </Link>
        </div>
        <p className="mt-2 text-sm text-charcoal/70">
          {branches.length} branches across the network, {branches.filter((b) => b.needsPlaceholder).length} of
          them still awaiting a photograph. Photographs, descriptions, locations, news and events are all
          edited from the branch manager.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {branches.map((b) => (
            <li key={b.slug} className="flex items-center justify-between gap-3 rounded-xl border border-purple-600/10 bg-white p-3 text-sm">
              <span>
                <strong>{b.name}</strong>
                {b.location && <span className="text-charcoal/60"> — {b.location}</span>}
              </span>
              <Link href={`/admin/tipu/branches/${b.slug}/edit`} className="shrink-0 font-medium text-purple-600 hover:underline">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-purple-600">Announcements</h2>
        <div className="mt-3"><AddTipuAnnouncementForm /></div>
        <ul className="mt-4 flex flex-col gap-2">
          {(announcements.data ?? []).map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-xl border border-purple-600/10 bg-white p-3 text-sm">
              <span className="flex items-center gap-2"><strong>{a.title}</strong> <StatusBadge status={a.status} /></span>
              <DeleteButton action={deleteTipuAnnouncementAction.bind(null, a.id)} label="announcement" />
            </li>
          ))}
          {(!announcements.data || announcements.data.length === 0) && <p className="text-sm text-charcoal/50">No announcements yet.</p>}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl font-bold text-purple-600">Documents</h2>
        <div className="mt-3"><AddTipuDocumentForm /></div>
        <ul className="mt-4 flex flex-col gap-2">
          {(documents.data ?? []).map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-xl border border-purple-600/10 bg-white p-3 text-sm">
              <span><strong>{d.title}</strong>{d.document_type && ` — ${d.document_type}`}</span>
              <DeleteButton action={deleteTipuDocumentAction.bind(null, d.id)} label="document" />
            </li>
          ))}
          {(!documents.data || documents.data.length === 0) && <p className="text-sm text-charcoal/50">No documents yet.</p>}
        </ul>
      </section>

      <p className="text-xs text-charcoal/50">TIPU projects (project pipeline) remain Supabase Studio-managed for now — see docs/ADMIN_GUIDE.md.</p>
    </div>
  );
}
