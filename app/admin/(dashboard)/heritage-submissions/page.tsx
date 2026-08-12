import { createClient } from "@/lib/supabase/server";
import { InboxStatusSelect } from "@/components/admin/InboxStatusSelect";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Heritage Submissions — Admin" };

export default async function AdminHeritageSubmissionsPage() {
  const supabase = await createClient();
  const { data: submissions } = supabase
    ? await supabase.from("heritage_submissions").select("*").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Heritage Submissions</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Family history, Oríkì and archive contributions awaiting review. Nothing here is published until
        an archivist accepts it and creates the corresponding record.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {(submissions ?? []).map((s) => (
          <div key={s.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">{String(s.submission_type).replace(/_/g, " ")}</p>
                <p className="font-semibold text-charcoal">{s.family_name ?? "(no family name given)"} {s.compound && `· ${s.compound}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-charcoal/50">{formatDate(s.created_at)}</span>
                <InboxStatusSelect
                  table="heritage_submissions"
                  id={s.id}
                  statusColumn="review_status"
                  currentStatus={s.review_status}
                  options={["pending", "in_review", "accepted", "needs_more_info", "declined"]}
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-charcoal/80">{s.payload?.details}</p>
            {s.payload?.source_information && (
              <p className="mt-1 text-xs text-charcoal/50">Source: {s.payload.source_information}</p>
            )}
            <p className="mt-2 text-xs text-charcoal/50">
              Submitted by {s.submitter_name} ({s.submitter_email})
              {s.submitter_relationship && ` — ${s.submitter_relationship}`}
              {" · "}Archive permission: {s.permission_to_archive ? "Yes" : "No"}
              {" · "}Publish permission: {s.permission_to_publish ? "Yes" : "No"}
            </p>
          </div>
        ))}
        {(!submissions || submissions.length === 0) && <p className="text-sm text-charcoal/50">No submissions yet.</p>}
      </div>
    </div>
  );
}
