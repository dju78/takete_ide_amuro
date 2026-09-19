import type { Metadata } from "next";
import { SettlementProgressGallery, type SettlementPhoto } from "@/components/development/SettlementProgressGallery";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Settlement & Community Progress | Takete-Ide Amuro",
  description:
    "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
  alternates: {
    canonical: `${siteConfig.url}/development/settlement-progress`,
  },
  openGraph: {
    title: "Settlement & Community Progress | Takete-Ide Amuro",
    description:
      "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
    url: `${siteConfig.url}/development/settlement-progress`,
    siteName: siteConfig.name,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Settlement & Community Progress | Takete-Ide Amuro",
    description:
      "A photographic record of contemporary residential development and the changing built environment of Takete-Ide, documenting the physical growth of the community.",
  },
};

export const revalidate = 3600;

// Hero photograph
const heroPhoto: SettlementPhoto = {
  id: "sp-01",
  src: "/images/takete-ide/development/settlement-progress/settlement-progress-01.jpg",
  title: "Contemporary residential building in Takete-Ide",
  alt: "Contemporary residential building with modern roofing and perimeter fencing in Takete-Ide",
  caption: "A modern residential development in Takete-Ide",
};

// Section 1: A Changing Built Environment (2 side-by-side photos)
const changingEnvironmentPhotos: SettlementPhoto[] = [
  {
    id: "sp-02",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-02.jpg",
    title: "Contemporary residential building in Takete-Ide",
    alt: "Modern single-storey residential home within the Takete-Ide settlement",
    caption: "Contemporary residential building in Takete-Ide",
  },
  {
    id: "sp-03",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-03.jpg",
    title: "Modern home within the Takete-Ide settlement",
    alt: "Residential development surrounded by green landscape in Takete-Ide",
    caption: "Modern home within the Takete-Ide settlement",
  },
];

// Section 2: Contemporary Residential Development (Row 1 - 3 photos)
const residentialPhotosRow1: SettlementPhoto[] = [
  {
    id: "sp-04",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-04.jpg",
    title: "Residential development within the community",
    alt: "Contemporary residential home with paved frontage in Takete-Ide",
    caption: "Residential development within the community",
  },
  {
    id: "sp-05",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-05.jpg",
    title: "Expanding residential and institutional development",
    alt: "Multi-storey residential structure in Takete-Ide",
    caption: "Expanding residential and institutional development",
  },
  {
    id: "sp-07",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-07.jpg",
    title: "Residential property in Takete-Ide",
    alt: "Single-storey residential home in Takete-Ide",
    caption: "Residential property in Takete-Ide",
  },
];

// Section 2: Contemporary Residential Development (Row 2 - 3 photos)
const residentialPhotosRow2: SettlementPhoto[] = [
  {
    id: "sp-06",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-06.jpg",
    title: "Modern residential building in Takete-Ide",
    alt: "Modern house with clean architectural lines in Takete-Ide",
    caption: "Modern residential building in Takete-Ide",
  },
  {
    id: "sp-08",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-08.jpg",
    title: "Contemporary home in Takete-Ide",
    alt: "Contemporary residential building with security gate in Takete-Ide",
    caption: "Contemporary home in Takete-Ide",
  },
  {
    id: "sp-09",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-09.jpg",
    title: "Contemporary residential development in Takete-Ide",
    alt: "Modern multi-room residential home in Takete-Ide",
    caption: "Contemporary residential development in Takete-Ide",
  },
  {
    id: "sp-10",
    src: "/images/takete-ide/development/settlement-progress/settlement-progress-10.jpg",
    title: "Modern Building Development in Takete-Ide",
    alt: "Modern multi-storey building within Takete-Ide community",
    caption: "A modern building reflecting continuing physical development within Takete-Ide community",
  },
];

export default function SettlementProgressPage() {
  return (
    <SettlementProgressGallery
      heroPhoto={heroPhoto}
      changingEnvironmentPhotos={changingEnvironmentPhotos}
      residentialPhotosRow1={residentialPhotosRow1}
      residentialPhotosRow2={residentialPhotosRow2}
    />
  );
}
