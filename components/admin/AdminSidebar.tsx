import Link from "next/link";
import {
  LayoutDashboard, Newspaper, Calendar, Images, Building2, Archive, Mic2,
  Crown, Users, Globe2, Mail, FileText, FolderKanban, Users2, Shield,
  Settings, ClipboardList, HeartHandshake, Landmark, ImagePlay, Network,
  Sparkles, ShieldCheck, BookOpen, Banknote,
} from "lucide-react";

/**
 * Grouped by what an administrator is trying to do, not by database table.
 * Financial screens sit in their own section because they carry a stricter
 * permission (super admin or treasurer) — see lib/auth.ts.
 */
const sections: { heading: string; items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    heading: "Content",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: Calendar },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
      { label: "Community Media", href: "/admin/community-media", icon: ImagePlay },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "TIPU Branches", href: "/admin/tipu/branches", icon: Network },
      { label: "TIPU Leadership", href: "/admin/tipu", icon: Landmark },
      { label: "Diaspora", href: "/admin/diaspora", icon: Globe2 },
      { label: "Community Profiles", href: "/admin/people", icon: Users },
      { label: "Traditional Leaders", href: "/admin/traditional-institution", icon: Crown },
    ],
  },
  {
    heading: "Heritage",
    items: [
      { label: "Families & Oríkì", href: "/admin/families", icon: HeartHandshake },
      { label: "Historical Archive", href: "/admin/archive", icon: Archive },
      { label: "Oral Histories", href: "/admin/oral-history", icon: Mic2 },
      { label: "Heritage Submissions", href: "/admin/heritage-submissions", icon: BookOpen },
    ],
  },
  {
    heading: "Development",
    items: [
      { label: "Projects", href: "/admin/projects", icon: Building2 },
      { label: "Security Trust Fund", href: "/admin/centenary", icon: ShieldCheck },
    ],
  },
  {
    heading: "Centenary",
    items: [{ label: "Centenary 2026", href: "/admin/centenary", icon: Sparkles }],
  },
  {
    heading: "Support",
    items: [{ label: "Official Account", href: "/admin/support", icon: Banknote }],
  },
  {
    heading: "Inbox",
    items: [
      { label: "Contact Messages", href: "/admin/messages", icon: Mail },
      { label: "Volunteer & Nominations", href: "/admin/volunteers", icon: ClipboardList },
      { label: "Submissions", href: "/admin/heritage-submissions", icon: FolderKanban },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Documents & Media", href: "/admin/media", icon: FileText },
      { label: "Users & Roles", href: "/admin/users", icon: Users2 },
      { label: "Website Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Log", href: "/admin/audit-log", icon: Shield },
    ],
  },
];

export function AdminSidebar() {
  return (
    <nav aria-label="Admin" className="flex h-full w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-purple-600/10 bg-white p-4">
      <Link href="/" className="px-2 font-serif text-lg font-bold text-purple-600">
        Takete-Ide Admin
      </Link>
      {sections.map((section) => (
        <div key={section.heading}>
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-charcoal/40">{section.heading}</p>
          <ul className="mt-1 space-y-0.5">
            {section.items.map((item) => (
              <li key={`${section.heading}-${item.href}`}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-charcoal/80 hover:bg-purple-50 hover:text-purple-600"
                >
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
