import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";
import { AddEventMediaForm } from "@/components/admin/AddEventMediaForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { updateEventAction, deleteEventMediaAction } from "@/lib/actions/admin-events";

export const metadata = { title: "Edit Event — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const [{ data: event }, { data: media }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase.from("event_media").select("id, media_type, url, caption").eq("event_id", id).order("sort_order"),
  ]);
  if (!event) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Edit Takete-Ide Day {event.year}</h1>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <EventForm action={updateEventAction.bind(null, id)} defaultValues={event} />
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-xl font-bold text-purple-600">Photos & Video</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(media ?? []).map((m) => (
            <div key={m.id} className="relative overflow-hidden rounded-xl border border-purple-600/10">
              {m.media_type === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.caption ?? ""} className="aspect-square w-full object-cover" />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-purple-50 text-xs text-purple-600">Video</div>
              )}
              <div className="absolute right-1 top-1">
                <DeleteButton action={deleteEventMediaAction.bind(null, id, m.id)} label="media" />
              </div>
            </div>
          ))}
          {(!media || media.length === 0) && <p className="col-span-full text-sm text-charcoal/50">No media added yet.</p>}
        </div>
        <div className="mt-4 max-w-sm">
          <AddEventMediaForm eventId={id} />
        </div>
      </div>
    </div>
  );
}
