import Link from "next/link";
import {
  LayoutDashboard, Newspaper, Calendar, Images, Building2, Archive, Mic2,
  Crown, Users, Globe2, Mail, FileText, FolderKanban, Users2, Shield,
  Settings, ClipboardList, HeartHandshake, Landmark,
} from "lucide-react";

const sections: { heading: string; items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    heading: "Content",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Takete-Ide Day Events", href: "/admin/events", icon: Calendar },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
      { label: "Development Projects", href: "/admin/projects", icon: Building2 },
    ],
  },
  {
    heading: "Heritage",
    items: [
      { label: "Historical Archive", href: "/admin/archive", icon: Archive },
      { label: "Oral Histories", href: "/admin/oral-history", icon: Mic2 },
      { label: "Traditional Leaders", href: "/admin/traditional-institution", icon: Crown },
      { label: "Families & Oríkì", href: "/admin/families", icon: HeartHandshake },
      { label: "Community Profiles", href: "/admin/people", icon: Users },
      { label: "TIPU", href: "/admin/tipu", icon: Landmark },
    ],
  },
  {
    heading: "Inbox",
    items: [
      { label: "Diaspora Submissions", href: "/admin/diaspora", icon: Globe2 },
      { label: "Contact Messages", href: "/admin/messages", icon: Mail },
      { label: "Heritage Submissions", href: "/admin/heritage-submissions", icon: FolderKanban },
      { label: "Volunteer & Nominations", href: "/admin/volunteers", icon: ClipboardList },
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
              <li key={item.href}>
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
