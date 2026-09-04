import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { YouTubeGlyph } from "@/components/layout/BrandGlyphs";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings } from "@/lib/data/settings";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Takete-Ide Amuro.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const email = settings.contact_email || siteConfig.contact.email;
  const youtubeUrl = settings.social_links?.youtube || siteConfig.contact.youtube;

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Contact" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-white/80">We&rsquo;d love to hear from you.</p>
        </Container>
      </div>

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-purple-600/10 bg-white p-6">
            <h2 className="font-serif text-lg font-bold text-purple-600">Get in Touch</h2>
            <dl className="mt-4 space-y-4 text-sm text-charcoal/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-600/60" aria-hidden="true" />
                <dd>
                  {siteConfig.location.community}, {siteConfig.location.lga}, {siteConfig.location.state},{" "}
                  {siteConfig.location.country}
                </dd>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-600/60" aria-hidden="true" />
                <dd>
                  {email ? (
                    <a
                      href={`mailto:${email}`}
                      className="font-medium text-purple-700 transition-colors hover:text-purple-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                      aria-label={`Send an email to ${email}`}
                    >
                      {email}
                    </a>
                  ) : (
                    <span className="italic text-charcoal/50">Email address to be published by the admin team.</span>
                  )}
                </dd>
              </div>
              {youtubeUrl && (
                <div className="flex items-start gap-3">
                  <YouTubeGlyph className="mt-0.5 h-4 w-4 shrink-0 text-purple-600/60" />
                  <dd>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">YouTube</span>
                      <a
                        href={youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-purple-700 transition-colors hover:text-purple-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        aria-label="Takete-Ide Amuro YouTube Channel (opens in a new tab)"
                      >
                        Takete-Ide Amuro YouTube Channel
                      </a>
                    </div>
                  </dd>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-purple-600/60" aria-hidden="true" />
                <dd>
                  {settings.contact_phone ?? (
                    <span className="italic text-charcoal/50">Phone number to be published by the admin team.</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          <p className="text-xs text-charcoal/50">
            Contact details are managed by site administrators and will appear here once configured — see{" "}
            <code>docs/DECISIONS.md</code>.
          </p>
        </div>

        <div className="rounded-2xl border border-purple-600/10 bg-white p-8">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
