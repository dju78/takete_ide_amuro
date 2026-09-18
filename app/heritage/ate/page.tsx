import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageImage } from "@/components/ui/HeritageImage";

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
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lg">
            <HeritageImage
              src="/images/takete-ide/ate-egungun.jpg"
              alt="Ate, one of the Egungun traditions of Takete-Ide, in full masquerade dress"
              label="Ate Masquerade Dress"
              fill
              sizes="(min-width: 640px) 384px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-lg">
            <HeritageImage
              src="/images/takete-ide/heritage/egungun-festival.png"
              alt="Community members gathered around an Egungun masquerade at a cultural celebration in Takete-Ide"
              label="Egungun Festival Gathering"
              fill
              sizes="(min-width: 640px) 384px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <section className="prose-heritage mt-10">
          <h2>About Ate</h2>
          <p>
            Ate is a distinctive masquerade tradition within the vibrant Egungun heritage of Takete-Ide.
            Appearing during seasonal cultural celebrations, Ate is adorned in traditional textile dress
            and symbolic regalia, accompanied by community processions, ceremonial drumming, and traditional chants.
          </p>
          <p>
            For a comprehensive overview of masquerade groupings including Agado, Oliwo, Origi, and Apa regerege,
            explore the <Link href="/heritage/festivals" className="text-community-green underline underline-offset-2">Festivals &amp; Traditions</Link> archive.
          </p>
        </section>
      </Container>
    </div>
  );
}
