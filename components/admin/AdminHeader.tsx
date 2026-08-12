import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import type { StaffUser } from "@/lib/auth";

export function AdminHeader({ user }: { user: StaffUser }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-purple-600/10 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-medium text-charcoal">{user.full_name ?? user.email}</p>
          <p className="text-xs capitalize text-charcoal/50">{user.role.replace(/_/g, " ")}</p>
        </div>
        <Link href="/" className="text-xs font-medium text-purple-600 hover:underline">
          View site
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-charcoal/70 hover:bg-purple-50">
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
