import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { FacebookGlyph, InstagramGlyph } from "@/components/layout/BrandGlyphs";
import { footerGroups, siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { FooterAccordion } from "@/components/layout/FooterAccordion";

// Secondary utility links — the footer's job now is quick access, not primary
// discovery (that's the header mega-menu). See docs/DECISIONS.md.
const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="bg-purple-700 text-white">
      <div className="border-b border-white/10">
        <Container className="flex flex-col items-center gap-6 py-12 text-center sm:py-14 md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Join the Journey of Preservation and Progress
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/80">
              Whether at home or in the diaspora, your skills, knowledge and support can help
              preserve our heritage and advance community development.
            </p>
          </div>
          <ButtonLink href="/get-involved" size="lg" className="w-full shrink-0 justify-center md:w-auto">
            Get Involved
          </ButtonLink>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        <div className="text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Logo dark />
          </div>
          <p className="mt-4 text-sm text-white/70">
            {siteConfig.location.lga}, {siteConfig.location.state}, {siteConfig.location.country}
          </p>
        </div>

        {/* Mobile: accordion. Desktop: condensed heading row. Same data, different presentation. */}
        <div className="mt-8">
          <FooterAccordion />
          {/* Desktop: full columns. The footer is where people go looking for a
              specific destination, so it lists them rather than just headings. */}
          <nav aria-label="Footer sections" className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
            {footerGroups.map((group) => (
              <div key={group.heading}>
                <p className="text-sm font-semibold uppercase tracking-wide text-gold-300">
                  {group.heading}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={`${group.heading}-${item.href}-${item.label}`}>
                      <Link href={item.href} className="text-sm text-white/75 hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/60">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex min-h-6 items-center py-1 hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3">
            <SocialIcon href="#" label="Facebook" Icon={FacebookGlyph} disabled />
            <SocialIcon href="#" label="Instagram" Icon={InstagramGlyph} disabled />
            <SocialIcon href="/contact" label="Contact via WhatsApp" Icon={MessageCircle} />
            <SocialIcon href="/contact" label="Email" Icon={Mail} />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-medium text-gold-300/80">Heritage &bull; Unity &bull; Progress</p>
        </Container>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  Icon,
  disabled,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        title={`${label} — coming soon`}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/40"
      >
        <Icon className="h-4 w-4" />
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold-500 hover:text-purple-900"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
}
