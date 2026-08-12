import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return (
    <div className="bg-ivory">
      <Container className="max-w-3xl py-16">
        <Breadcrumb items={[{ label: "Accessibility" }]} />
        <h1 className="mt-4 font-serif text-4xl font-bold text-purple-600">Accessibility Statement</h1>
        <div className="prose-heritage mt-8 text-charcoal/85">
          <p>
            Takete-Ide Amuro is committed to making this website usable by as many people as possible,
            including people using assistive technology, screen readers, keyboard-only navigation, or
            browsing with reduced motion or high-contrast settings.
          </p>

          <h2>Our Commitments</h2>
          <ul>
            <li>Semantic HTML and landmark regions throughout the site.</li>
            <li>Keyboard-accessible navigation, menus and forms, with visible focus states.</li>
            <li>Sufficient colour contrast in line with WCAG 2.2 AA, wherever practical.</li>
            <li>Text alternatives for meaningful images, and never relying on weather icons or colour alone to convey information.</li>
            <li>Respect for the <code>prefers-reduced-motion</code> setting.</li>
            <li>A skip-to-content link on every page.</li>
          </ul>

          <h2>Known Limitations</h2>
          <p>
            As a actively developed platform, some pages — particularly rich media (audio/video in the
            Oríkì and Oral History archives) — may not yet have complete captions or transcripts for every
            item. These are added progressively as source material allows.
          </p>

          <h2>Reporting an Accessibility Problem</h2>
          <p>
            If you encounter an accessibility barrier on this site, please let us know using the form below
            so we can investigate and fix it.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-purple-600/10 bg-white p-8">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
