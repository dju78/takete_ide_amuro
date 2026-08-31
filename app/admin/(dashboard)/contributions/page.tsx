import Link from "next/link";
import { requireFinancialAdmin } from "@/lib/auth";
import {
  listContributions,
  summarise,
  toMajor,
  CONTRIBUTION_STATUSES,
  CONTRIBUTION_PURPOSES,
} from "@/lib/payments/contributions";
import { paystackMode } from "@/lib/env";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Contributions — Admin" };

interface Props {
  searchParams: Promise<{ status?: string; purpose?: string; channel?: string; from?: string; to?: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  successful: "bg-green-600/10 text-green-700",
  pending: "bg-gold-100 text-gold-700",
  failed: "bg-red-100 text-red-700",
  abandoned: "bg-charcoal/10 text-charcoal",
  reversed: "bg-purple-50 text-purple-600",
};

export default async function AdminContributionsPage({ searchParams }: Props) {
  // Financial data: super_admin or treasurer only. This is a server-side
  // redirect, not a hidden menu item — and RLS on `contributions` enforces the
  // same restriction independently at the database.
  const user = await requireFinancialAdmin();
  const filters = await searchParams;
  const rows = await listContributions(filters);
  const totals = summarise(rows);

  const qs = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...filters, ...patch })) {
      if (v) params.set(k, v);
    }
    const s = params.toString();
    return s ? `/admin/contributions?${s}` : "/admin/contributions";
  };

  const chip = (active: boolean) =>
    `inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs font-medium ${
      active ? "bg-purple-600 text-white" : "bg-white text-charcoal/70 hover:bg-purple-50"
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-bold text-purple-600">Contributions</h1>
        {paystackMode !== "live" && (
          <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
            Paystack {paystackMode === "test" ? "test mode" : "not configured"}
          </span>
        )}
      </div>
      <p className="mt-2 max-w-3xl text-sm text-charcoal/70">
        Online contributions recorded by the site. Signed in as{" "}
        <span className="font-medium text-charcoal">{user.role.replace(/_/g, " ")}</span>. Card numbers,
        CVVs, PINs and one-time codes are never seen or stored by this site, so none appear here.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Shown" value={String(totals.count)} />
        <Stat label="Successful" value={String(totals.successfulCount)} />
        <Stat label="Total verified" value={formatCurrency(totals.totalMajor)} />
      </dl>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">Status</span>
          <Link href={qs({ status: undefined })} className={chip(!filters.status)}>
            All
          </Link>
          {CONTRIBUTION_STATUSES.map((s) => (
            <Link key={s} href={qs({ status: s })} className={chip(filters.status === s)}>
              {s}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">Purpose</span>
          <Link href={qs({ purpose: undefined })} className={chip(!filters.purpose)}>
            All
          </Link>
          {CONTRIBUTION_PURPOSES.map((p) => (
            <Link key={p} href={qs({ purpose: p })} className={chip(filters.purpose === p)}>
              {p}
            </Link>
          ))}
        </div>
        <form method="get" className="flex flex-wrap items-end gap-3">
          {filters.status && <input type="hidden" name="status" value={filters.status} />}
          {filters.purpose && <input type="hidden" name="purpose" value={filters.purpose} />}
          <label className="text-xs font-medium text-charcoal/60">
            From
            <input
              type="date"
              name="from"
              defaultValue={filters.from}
              className="mt-1 block rounded-lg border border-purple-600/15 px-3 py-1.5 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-charcoal/60">
            To
            <input
              type="date"
              name="to"
              defaultValue={filters.to}
              className="mt-1 block rounded-lg border border-purple-600/15 px-3 py-1.5 text-sm"
            />
          </label>
          <button
            type="submit"
            className="min-h-9 rounded-full bg-purple-600 px-4 text-sm font-semibold text-white hover:bg-purple-400"
          >
            Apply dates
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-purple-600/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-purple-600/10 text-xs uppercase text-charcoal/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Contributor</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-purple-600/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-charcoal/70">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-charcoal/80">{r.reference}</code>
                </td>
                <td className="px-4 py-3">
                  <span className="block font-medium text-charcoal">
                    {r.contributor_name ?? <span className="text-charcoal/45">Anonymous</span>}
                  </span>
                  <span className="block text-xs text-charcoal/55">{r.email}</span>
                </td>
                <td className="px-4 py-3 text-charcoal/70">{r.purpose}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-charcoal">
                  {formatCurrency(toMajor(r.amount_minor), r.currency)}
                </td>
                <td className="px-4 py-3 text-charcoal/70">{r.channel ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      STATUS_STYLES[r.status] ?? "bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-charcoal/60">
                  {r.verified_at ? formatDate(r.verified_at) : "—"}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-charcoal/50">
                  No contributions match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-charcoal/50">
        A contribution is marked successful only after the server verifies it with Paystack and the
        reference, amount and currency all match the record created before checkout. Self-reported bank
        transfers are never marked successful automatically.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-purple-600/10 bg-white p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal/45">{label}</dt>
      <dd className="mt-1 font-serif text-2xl font-bold text-purple-600">{value}</dd>
    </div>
  );
}
