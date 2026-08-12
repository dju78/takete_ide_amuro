import { Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export async function AnnouncementBanner() {
  const supabase = await createClient();
  if (!supabase) return null;

  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("announcements")
    .select("id, title, message")
    .eq("is_active", true)
    .lte("start_date", today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return (
    <div className="bg-gold-500 text-purple-900">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm font-medium sm:px-6 lg:px-8">
        <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          <span className="font-semibold">{data.title}:</span> {data.message}
        </p>
      </div>
    </div>
  );
}
