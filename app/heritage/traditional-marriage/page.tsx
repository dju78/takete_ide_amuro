import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Traditional Marriage",
  description: "Ceremonial items and gatherings associated with marriage celebrations in Takete-Ide Amuro.",
};

export default function TraditionalMarriagePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Heritage", href: "/heritage" }, { label: "Traditional Marriage" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Traditional Marriage</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Ceremonial items and gatherings associated with marriage celebrations in Takete-Ide.
          </p>
        </Container>
      </div>

      <Container className="max-w-4xl py-16">
        <ResearchDisclaimer />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <HeritageImage
              src="/images/takete-ide/marriage-celebration-1.jpg"
              alt="Ceremonial items associated with a marriage celebration in Takete-Ide"
              label="Marriage Celebration"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
            <HeritageImage
              src="/images/takete-ide/marriage-celebration-2.jpg"
              alt="A marriage celebration gathering in Takete-Ide"
              label="Marriage Celebration"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Section: Gifts, Household Preparation & Celebration */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-purple-900 sm:text-3xl">
            Gifts, Household Preparation &amp; Celebration
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
            Household items and gifts presented as part of a Takete-Ide marriage celebration.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md border border-purple-600/10">
              <HeritageImage
                src="/images/takete-ide/heritage/traditional-marriage-gifts-01.png"
                alt="Household items and gift presentations prepared for a traditional marriage ceremony in Takete-Ide"
                label="Marriage Preparation &amp; Gifts"
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md border border-purple-600/10">
              <HeritageImage
                src="/images/takete-ide/heritage/traditional-marriage-gifts-02.png"
                alt="Gift presentations and gathering of family members at a Takete-Ide traditional marriage celebration"
                label="Celebration &amp; Gift Presentation"
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="prose-heritage mt-12">
          <h2>About These Photographs</h2>
          <p>
            These photographs show ceremonial items and community gatherings associated with marriage
            celebrations in Takete-Ide. In keeping with this archive&rsquo;s approach to unverified
            detail, the specific meaning and ritual significance of the individual items shown has not
            been confirmed, so it is described here only in general terms rather than asserted as
            fact.
          </p>
          <p>
            If you can help document the traditions, items and customs associated with marriage
            celebrations in Takete-Ide, please{" "}
            <Link href="/families/contribute" className="text-community-green underline underline-offset-2">
              contribute what you know
            </Link>
            .
          </p>
        </section>
      </Container>
    </div>
  );
}
