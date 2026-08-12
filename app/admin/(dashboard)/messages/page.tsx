import { createClient } from "@/lib/supabase/server";
import { InboxStatusSelect } from "@/components/admin/InboxStatusSelect";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Contact Messages — Admin" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = supabase
    ? await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Contact Messages</h1>
      <p className="mt-1 text-sm text-charcoal/60">Never shown publicly — visible to staff only.</p>

      <div className="mt-6 flex flex-col gap-4">
        {(messages ?? []).map((m) => (
          <div key={m.id} className="rounded-2xl border border-purple-600/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-charcoal">{m.name} &lt;{m.email}&gt;</p>
                {m.subject && <p className="text-sm text-charcoal/60">{m.subject}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-charcoal/50">{formatDate(m.created_at)}</span>
                <InboxStatusSelect table="contact_messages" id={m.id} statusColumn="status" currentStatus={m.status} options={["new", "read", "replied", "archived"]} />
              </div>
            </div>
            <p className="mt-3 text-sm text-charcoal/80">{m.message}</p>
          </div>
        ))}
        {(!messages || messages.length === 0) && <p className="text-sm text-charcoal/50">No messages yet.</p>}
      </div>
    </div>
  );
}
