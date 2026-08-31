import { requireStaff } from "@/lib/auth";
import { getCentenary, getSecurityTrustFund } from "@/lib/data/community-programme";
import { CentenaryForm } from "@/components/admin/CentenaryForm";
import { TrustFundForm } from "@/components/admin/TrustFundForm";
import { isFinancialAdmin } from "@/lib/auth";

export const metadata = { title: "Centenary & Funds — Admin" };

export default async function AdminCentenaryPage() {
  const user = await requireStaff("administrator");
  const [centenary, fund] = await Promise.all([getCentenary(), getSecurityTrustFund()]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-purple-600">Centenary 2026</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Event details shown on the Centenary page, the homepage countdown and the TIPU overview. The
        countdown is driven by the event date below.
      </p>
      <div className="mt-6 rounded-2xl border border-purple-600/10 bg-white p-6">
        <CentenaryForm centenary={centenary} />
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-bold text-purple-600">Security Trust Fund</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          Figures published on the Support and Development pages. Always record the date the union
          reported them — the site labels these as a dated community record, never as a live balance,
          and the percentage is calculated from the two amounts.
        </p>
        {isFinancialAdmin(user.role) ? (
          <div className="mt-4 rounded-2xl border border-purple-600/10 bg-white p-6">
            <TrustFundForm fund={fund} />
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-purple-600/10 bg-purple-50/50 p-5 text-sm text-charcoal/70">
            Fund figures can only be changed by a super administrator or the treasurer. Current reported
            position: {fund.amountPaid.toLocaleString()} of {fund.targetAmount.toLocaleString()}{" "}
            {fund.currency}, as at {fund.asOf}.
          </p>
        )}
      </section>
    </div>
  );
}
