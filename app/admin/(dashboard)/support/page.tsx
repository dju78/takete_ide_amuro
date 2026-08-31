import { requireFinancialAdmin } from "@/lib/auth";
import { getAllSupportAccounts } from "@/lib/data/community-programme";
import { OFFICIAL_SUPPORT_ACCOUNT } from "@/lib/media/community-programme";
import { SupportAccountForm, type AccountRow } from "@/components/admin/SupportAccountForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deactivateSupportAccountAction } from "@/lib/actions/admin-community-programme";

export const metadata = { title: "Official Account — Admin" };

export default async function AdminSupportPage() {
  // Stricter than the rest of the admin area: super administrators and
  // treasurers only. An ordinary administrator cannot reach this screen.
  const user = await requireFinancialAdmin();
  const accounts = (await getAllSupportAccounts()) as AccountRow[];
  const active = accounts.find((a) => a.is_active);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Official Contribution Account</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        The account published on the public Support page. You are signed in as{" "}
        <span className="font-medium text-charcoal">{user.role.replace(/_/g, " ")}</span>.
      </p>

      {accounts.length === 0 && (
        <div className="mt-6 rounded-2xl border border-purple-600/10 bg-purple-50/50 p-5 text-sm leading-relaxed text-charcoal/75">
          <p className="font-medium text-charcoal">No account record has been saved yet.</p>
          <p className="mt-1">
            Until one is, the site publishes the account it ships with:{" "}
            <span className="font-medium">{OFFICIAL_SUPPORT_ACCOUNT.accountName}</span>,{" "}
            {OFFICIAL_SUPPORT_ACCOUNT.bankName}, {OFFICIAL_SUPPORT_ACCOUNT.accountNumber}. Saving below
            replaces it.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <SupportAccountForm account={active} />
      </div>

      {accounts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-xl font-bold text-purple-600">All account records</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            Deactivating every account removes the account card from the public page entirely — it does
            not fall back to a default.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-600/10 bg-white p-4 text-sm"
              >
                <span>
                  <span className="font-medium text-charcoal">{a.account_name}</span>
                  <span className="text-charcoal/60">
                    {" "}
                    — {a.bank_name} &middot; <span className="tabular-nums">{a.account_number}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      a.is_active ? "bg-green-600/10 text-green-700" : "bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {a.is_active ? "Published" : "Hidden"}
                  </span>
                  {a.is_active && (
                    <DeleteButton
                      action={deactivateSupportAccountAction.bind(null, a.id)}
                      label="account from the public page (deactivate)"
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs leading-relaxed text-charcoal/50">
        Historic personal and campaign-specific accounts that appear in the community archive are
        deliberately not published on this site. Only a verified organisational account should ever be
        activated here.
      </p>
    </div>
  );
}
