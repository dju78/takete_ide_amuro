import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageVideo } from "@/components/ui/HeritageVideo";
import { ResearchDisclaimer } from "@/components/heritage/ResearchDisclaimer";

export const metadata: Metadata = {
  title: "Agado Festival",
  description: "Video footage from the Agado Festival, one of Takete-Ide Amuro's cultural celebrations.",
};

export default function AgadoFestivalPage() {
  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Heritage", href: "/heritage" }, { label: "Agado Festival" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Agado Festival</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Community video footage of the Agado Festival, part of Takete-Ide&rsquo;s living cultural
            heritage.
          </p>
        </Container>
      </div>

      <Container className="max-w-3xl py-16">
        <ResearchDisclaimer />

        <div className="mt-10 overflow-hidden rounded-3xl bg-black shadow-lg">
          <HeritageVideo
            src="/videos/takete-ide/agado-festival.mp4"
            label="Agado Festival footage"
            className="aspect-video w-full"
          />
        </div>
        <p className="mt-2 text-xs text-charcoal/50">
          Video supplied by the community. A transcript/caption track has not yet been produced for
          this recording — see docs/DECISIONS.md.
        </p>

        <section className="prose-heritage mt-10">
          <h2>About Agado</h2>
          <p>
            This footage documents the Agado Festival as celebrated in Takete-Ide Amuro. Detailed
            historical and cultural context — its origins, seasonal timing, and significance within
            the community&rsquo;s wider festival calendar — is being compiled with community elders
            and will be added here as it is verified. No historical claims are presented on this page
            beyond what the community has confirmed.
          </p>
        </section>
      </Container>
    </div>
  );
}
