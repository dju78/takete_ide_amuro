import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageImage } from "@/components/ui/HeritageImage";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Ate — Egungun Heritage",
  description: "Ate, one of the Egungun (masquerade) traditions observed in Takete-Ide Amuro.",
};

export default function AtePage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Heritage", href: "/heritage" }, { label: "Ate — Egungun Heritage" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Ate — Egungun Heritage</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Ate is one of the Egungun (masquerade) traditions observed in Takete-Ide Amuro.
          </p>
        </Container>
      </div>

      <Container className="max-w-3xl py-16">
        <ResearchDisclaimer />

        <div className="relative mt-10 aspect-[3/4] max-w-sm overflow-hidden rounded-3xl shadow-lg sm:mx-auto">
          <HeritageImage
            src="/images/takete-ide/ate-egungun.jpg"
            alt="Ate, one of the Egungun traditions of Takete-Ide, in full masquerade dress"
            label="Ate — Egungun Heritage"
            fill
            sizes="(min-width: 640px) 384px, 100vw"
            className="object-cover"
          />
        </div>

        <section className="prose-heritage mt-10">
          <h2>About Ate</h2>
          <p>
            Ate is <strong>one specific tradition</strong> within the wider Egungun (masquerade)
            heritage of Takete-Ide — it is not a general term for every masquerade figure in the
            community. The specific role, symbolism and occasions associated with Ate are being
            documented with community elders and family sources; nothing beyond what is shown in the
            photograph is asserted here until verified.
          </p>
          <p>
            If you can help confirm details about Ate or Takete-Ide&rsquo;s wider Egungun traditions,
            please{" "}
            <Link href="/get-involved" className="text-community-green underline underline-offset-2">
              get in touch
            </Link>
            .
          </p>
        </section>
      </Container>
    </div>
  );
}
