import Link from "next/link";
import { FileEdit, CheckCircle2, Clock, Building2, Inbox } from "lucide-react";
import { getDashboardStats } from "@/lib/data/admin";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Drafts", value: stats.draftCount, icon: FileEdit, href: "/admin/news" },
    { label: "Published", value: stats.publishedCount, icon: CheckCircle2, href: "/admin/news" },
    { label: "Pending Review", value: stats.pendingReviewCount, icon: Clock, href: "/admin/news" },
    { label: "Active Projects", value: stats.activeProjectsCount, icon: Building2, href: "/admin/projects" },
    { label: "New Submissions", value: stats.newSubmissionsCount, icon: Inbox, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-purple-600">Dashboard</h1>
      <p className="mt-1 text-sm text-charcoal/60">Welcome back. Here&rsquo;s what&rsquo;s happening across the site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-purple-600/10 bg-white p-5 shadow-sm hover:shadow-md">
            <c.icon className="h-5 w-5 text-purple-600" aria-hidden="true" />
            <p className="mt-3 text-3xl font-bold text-purple-600">{c.value}</p>
            <p className="text-sm text-charcoal/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-purple-600/10 bg-white p-6">
        <h2 className="font-serif text-lg font-bold text-purple-600">Recent Activity</h2>
        {stats.recentActivity.length > 0 ? (
          <ul className="mt-4 divide-y divide-purple-600/10">
            {stats.recentActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <strong className="capitalize">{a.action}</strong> on {a.entity_type.replace(/_/g, " ")}
                </span>
                <span className="text-charcoal/50">{formatDate(a.created_at, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-charcoal/50">No activity recorded yet.</p>
        )}
      </div>
    </div>
  );
}
