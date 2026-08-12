import { createClient } from "@/lib/supabase/server";
import { InboxStatusSelect } from "@/components/admin/InboxStatusSelect";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Volunteers & Nominations — Admin" };

export default async function AdminVolunteersPage() {
  const supabase = await createClient();
  const [volunteers, nominations] = await Promise.all([
    supabase ? supabase.from("volunteer_submissions").select("*").order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
    supabase ? supabase.from("community_profile_nominations").select("*").order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h1 className="font-serif text-2xl font-bold text-purple-600">Volunteer Submissions</h1>
        <div className="mt-6 flex flex-col gap-4">
          {(volunteers.data ?? []).map((v) => (
            <div key={v.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-charcoal">{v.full_name} &lt;{v.email}&gt;</p>
                  <p className="text-xs uppercase text-gold-700">{String(v.interest_area).replace(/_/g, " ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal/50">{formatDate(v.created_at)}</span>
                  <InboxStatusSelect table="volunteer_submissions" id={v.id} statusColumn="status" currentStatus={v.status} options={["new", "reviewed", "contacted", "archived"]} />
                </div>
              </div>
              {v.message && <p className="mt-2 text-sm text-charcoal/80">{v.message}</p>}
            </div>
          ))}
          {(!volunteers.data || volunteers.data.length === 0) && <p className="text-sm text-charcoal/50">No volunteer submissions yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold text-purple-600">Community Profile Nominations</h2>
        <div className="mt-6 flex flex-col gap-4">
          {(nominations.data ?? []).map((n) => (
            <div key={n.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-charcoal">{n.nominee_name}</p>
                  <p className="text-xs uppercase text-gold-700">{String(n.category).replace(/_/g, " ")}</p>
                </div>
                <InboxStatusSelect table="community_profile_nominations" id={n.id} statusColumn="review_status" currentStatus={n.review_status} options={["pending", "in_review", "accepted", "declined"]} />
              </div>
              <p className="mt-2 text-sm text-charcoal/80">{n.biography}</p>
              <p className="mt-1 text-xs text-charcoal/50">Submitted by {n.submitter_name} ({n.submitter_email})</p>
            </div>
          ))}
          {(!nominations.data || nominations.data.length === 0) && <p className="text-sm text-charcoal/50">No nominations yet.</p>}
        </div>
      </section>
    </div>
  );
}
