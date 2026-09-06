import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GooglePhotosArchiveSection } from "@/components/gallery/GooglePhotosArchiveSection";
import { getGalleryItems, getGalleryCategories } from "@/lib/data/gallery";
import { getSiteSettings } from "@/lib/data/settings";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of community life, Takete-Ide Day, the traditional institution and development projects.",
  alternates: {
    canonical: `${siteConfig.url}/gallery`,
  },
  openGraph: {
    title: "Gallery | Takete-Ide",
    description: "Photographs of community life, Takete-Ide Day, the traditional institution and development projects.",
    url: `${siteConfig.url}/gallery`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Takete-Ide",
    description: "Photographs of community life, Takete-Ide Day, the traditional institution and development projects.",
  },
};

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string; year?: string }>;
}

export default async function GalleryPage({ searchParams }: Props) {
  const { category, year } = await searchParams;
  const [items, categories, settings] = await Promise.all([
    getGalleryItems({ category, year: year ? Number(year) : undefined }),
    getGalleryCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="bg-ivory">
      <div className="bg-purple-700 py-14 text-white">
        <Container>
          <Breadcrumb items={[{ label: "Gallery" }]} />
          <h1 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">Gallery</h1>
          <p className="mt-3 max-w-2xl text-white/80">
            Community life, Takete-Ide Day, the traditional institution and development — in pictures.
          </p>
        </Container>
      </div>

      <Container className="py-16">
        <GalleryFilters categories={categories} activeCategory={category} />
        <div className="mt-8">
          {items.length > 0 ? (
            <GalleryLightbox items={items} />
          ) : (
            <EmptyState
              title="This gallery is being curated"
              message="Photographs for this category will appear here as they are uploaded and approved by the media team. You are also welcome to contribute photographs to the Takete-Ide Digital Archive."
            />
          )}
        </div>

        <GooglePhotosArchiveSection
          url={settings.google_photos_url}
          enabled={settings.google_photos_enabled}
          title={settings.google_photos_title}
          description={settings.google_photos_description}
        />
      </Container>
    </div>
  );
}
