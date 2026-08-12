import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata = { title: "Website Settings — Admin" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Website Settings</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Site identity, contact details and the Weather section. API credentials remain environment
        secrets and are never editable here.
      </p>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
