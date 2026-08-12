import { EventForm } from "@/components/admin/EventForm";
import { createEventAction } from "@/lib/actions/admin-events";

export const metadata = { title: "New Event — Admin" };

export default function NewEventPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">New Takete-Ide Day</h1>
      <p className="mt-1 text-sm text-charcoal/60">Creates a new year automatically — no developer needed.</p>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <EventForm action={createEventAction} />
      </div>
    </div>
  );
}
