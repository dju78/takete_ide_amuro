import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <div className="bg-ivory">
      <Container className="max-w-3xl py-16">
        <Breadcrumb items={[{ label: "Cookie Policy" }]} />
        <h1 className="mt-4 font-serif text-4xl font-bold text-purple-600">Cookie Policy</h1>
        <div className="prose-heritage mt-8 text-charcoal/85">
          <h2>Essential Cookies Only, Today</h2>
          <p>
            This website currently sets only strictly necessary cookies — used to keep administrators
            signed in securely to the admin portal. No non-essential analytics, advertising or tracking
            cookies are active.
          </p>
          <p>
            Because no non-essential cookies are currently set, this site does not show a cookie consent
            banner — a banner would have nothing meaningful to gate. If privacy-respecting analytics are
            enabled in future (see <code>docs/DECISIONS.md</code> and the <code>NEXT_PUBLIC_ANALYTICS_*</code>{" "}
            environment variables), a real consent banner that actually controls those technologies will be
            added at that time, replacing this page.
          </p>

          <h2>Essential Cookies We Set</h2>
          <ul>
            <li><strong>Supabase auth session</strong> — keeps signed-in administrators authenticated.</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
