import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-ivory">
      <Container className="max-w-3xl py-16">
        <Breadcrumb items={[{ label: "Privacy Policy" }]} />
        <h1 className="mt-4 font-serif text-4xl font-bold text-purple-600">Privacy Policy</h1>
        <div className="prose-heritage mt-8 text-charcoal/85">
          <div className="rounded-2xl border border-gold-500/30 bg-gold-100/50 p-5 text-sm">
            This is a draft privacy notice template. It should be reviewed by qualified legal counsel and
            formally approved by Takete-Ide Amuro before this website is treated as fully production-live —
            see <code>docs/DECISIONS.md</code>.
          </div>

          <h2>What This Policy Covers</h2>
          <p>
            This Privacy Policy explains how Takete-Ide Amuro (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
            uses and protects personal information submitted through this website, including the Contact,
            Diaspora Registration, Get Involved, Community Profile Nomination and Heritage Submission forms.
          </p>

          <h2>Information We Collect</h2>
          <ul>
            <li>Contact details you provide directly (name, email, phone, message content).</li>
            <li>Diaspora network registration details (country, city, profession, areas of expertise).</li>
            <li>Family history, Oríkì and archive material you choose to submit, along with source and contributor information.</li>
            <li>Basic technical data (such as browser type) collected automatically for security and performance.</li>
          </ul>

          <h2>How We Use Information</h2>
          <p>
            We use the information you provide to respond to enquiries, process diaspora registrations,
            review heritage and nomination submissions, and — only with your explicit consent — to publish
            community-facing content such as family histories, Oríkì, or profiles.
          </p>

          <h2>What We Never Publish Without Consent</h2>
          <p>
            Diaspora registration details, contact messages and volunteer submissions are never displayed
            publicly. Family, Oríkì and archive submissions are only published after review, and only where
            you have given explicit publication permission.
          </p>

          <h2>Data Storage and Security</h2>
          <p>
            Submitted data is stored using Supabase, with row-level security restricting access to
            authorised staff. See <Link href="/accessibility">Accessibility</Link> and <code>docs/SECURITY.md</code>{" "}
            for further technical detail.
          </p>

          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of personal information you have
            submitted by contacting us via the <Link href="/contact">Contact page</Link>.
          </p>

          <h2>Cookies</h2>
          <p>
            See our <Link href="/cookies">Cookie Policy</Link> for details of the technologies used on this site.
          </p>

          <h2>Contact</h2>
          <p>Questions about this policy can be sent via the <Link href="/contact">Contact page</Link>.</p>
        </div>
      </Container>
    </div>
  );
}
