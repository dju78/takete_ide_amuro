import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeritageVideo } from "@/components/ui/HeritageVideo";

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
            Community documentary video footage of the Agado Festival, part of Takete-Ide&rsquo;s living cultural
            heritage.
          </p>
        </Container>
      </div>

      <Container className="max-w-3xl py-16">
        <div className="overflow-hidden rounded-3xl bg-black shadow-lg">
          <HeritageVideo
            src="/videos/takete-ide/agado-festival.mp4"
            poster="/images/takete-ide/agado-festival.jpg"
            label="Agado Festival footage"
            className="aspect-video w-full"
          />
        </div>
        <p className="mt-2 text-xs text-charcoal/60">
          Recorded video footage documenting the Agado Festival celebrations in Takete-Ide.
        </p>

        <section className="prose-heritage mt-10">
          <h2>About the Agado Festival</h2>
          <p>
            The Agado Festival is one of the vibrant cultural celebrations preserved in Takete-Ide Amuro.
            Captured in live community footage, the celebration brings together music, traditional attire,
            and community fellowship across generations.
          </p>
        </section>
      </Container>
    </div>
  );
}
