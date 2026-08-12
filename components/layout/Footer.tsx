import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { FacebookGlyph, InstagramGlyph } from "@/components/layout/BrandGlyphs";
import { footerNav, siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="bg-purple-700 text-white">
      <div className="border-b border-white/10">
        <Container className="flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Join the Journey of Preservation and Progress
            </h2>
            <p className="mt-2 max-w-xl text-white/80">
              Whether at home or in the diaspora, your skills, knowledge and support can help
              preserve our heritage and advance community development.
            </p>
          </div>
          <ButtonLink href="/get-involved" size="lg" className="shrink-0">
            Get Involved
          </ButtonLink>
        </Container>
      </div>

      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo dark />
          <p className="mt-4 text-sm text-white/70">
            {siteConfig.location.lga}, {siteConfig.location.state}, {siteConfig.location.country}
          </p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href="#" label="Facebook" Icon={FacebookGlyph} disabled />
            <SocialIcon href="#" label="Instagram" Icon={InstagramGlyph} disabled />
            <SocialIcon href="/contact" label="Contact via WhatsApp" Icon={MessageCircle} />
            <SocialIcon href="/contact" label="Email" Icon={Mail} />
          </div>
        </div>

        {footerNav.map((group) => (
          <div key={group.heading}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-300">{group.heading}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/75 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Preserving Our Heritage. Building Our Future.</p>
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
