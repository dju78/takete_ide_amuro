import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { getLiveBroadcastWithIssues } from "@/lib/data/live-broadcast";
import { LiveBroadcastForm } from "@/components/admin/LiveBroadcastForm";

export const metadata = { title: "Live Broadcast — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLivePage() {
  await requireStaff("editor");
  const { broadcast, issues, databaseAvailable } = await getLiveBroadcastWithIssues();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Live Broadcast</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Controls the public{" "}
        <Link href="/live" className="underline" target="_blank">
          /live
        </Link>{" "}
        page: the YouTube player, status, public platform links and replays. The programme itself is edited under
        Centenary 2026. Operating instructions: <code>docs/LIVE_BROADCAST_RUNBOOK.md</code>.
      </p>

      <p className="mt-3 text-xs text-charcoal/60">
        Active configuration source:{" "}
        <strong>{broadcast.source === "database" ? "saved admin settings" : "checked-in file (lib/live/broadcast-config.ts)"}</strong>
      </p>

      {!databaseAvailable && (
        <div className="mt-4 rounded-xl bg-gold-100 p-4 text-sm text-purple-900">
          The <code>live_broadcast_settings</code> table is not available, so this form cannot save yet. Apply migration{" "}
          <code>0028_live_broadcast_settings.sql</code> in Supabase, or change <code>lib/live/broadcast-config.ts</code> and
          redeploy.
        </div>
      )}

      {issues.length > 0 && (
        <div role="alert" className="mt-4 rounded-xl bg-red-100 p-4 text-sm text-red-800">
          <p className="font-semibold">Configuration problems (hidden from the public page):</p>
          <ul className="mt-1 list-disc pl-5">
            {issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <LiveBroadcastForm broadcast={broadcast} />
      </div>
    </div>
  );
}
