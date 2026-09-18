import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BranchCard } from "@/components/tipu/BranchCard";
import { getBranchNetworkByGroup, getBranchUpdates, summariseUpdates } from "@/lib/data/tipu-branches";
import { GROUP_LABELS } from "@/lib/media/tipu-branches";

export const metadata: Metadata = {
  title: "Our TIPU Network",
  description:
    "Every branch and chapter of the Takete-Ide Progressive Union — at home in Takete-Ide, across Nigerian cities, and in the diaspora.",
};

export const revalidate = 3600;

export default async function TipuNetworkPage() {
  const [groups, updates] = await Promise.all([getBranchNetworkByGroup(), getBranchUpdates()]);
  const total = groups.reduce((n, g) => n + g.branches.length, 0);
  const withPhotos = groups.reduce((n, g) => n + g.branches.filter((b) => !b.needsPlaceholder).length, 0);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "TIPU", href: "/tipu" }, { label: "Our Branches" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Our TIPU Network</h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Across Takete-Ide, Nigerian cities and the diaspora, TIPU branches connect our people and
            strengthen participation in the development of our community — {total} in all.
          </p>
        </Container>
      </div>

      <Container className="py-14 sm:py-16">
        {groups.map(({ group, branches }) => (
          <section key={group} className="mb-16 last:mb-0">
            <SectionHeading
              eyebrow={GROUP_LABELS[group].title}
              title={GROUP_LABELS[group].heading}
              align="left"
              className="mx-0"
              description={GROUP_LABELS[group].description}
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => {
                const { latest, upcoming } = summariseUpdates(updates.get(branch.slug));
                return <BranchCard key={branch.slug} branch={branch} latest={latest} upcoming={upcoming} />;
              })}
            </div>
          </section>
        ))}

        <p className="mt-4 rounded-2xl border border-purple-600/10 bg-white p-5 text-sm leading-relaxed text-charcoal/70">
          This network directory represents Takete-Ide Progressive Union branches and chapters connecting sons and daughters across Nigeria and the diaspora.{" "}
          <a href="/contact" className="font-semibold text-community-green underline underline-offset-2">
            Contact union leadership to connect with your local branch →
          </a>
        </p>
      </Container>
    </div>
  );
}
