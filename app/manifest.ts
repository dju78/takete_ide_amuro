import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Takete-Ide",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9EF",
    theme_color: "#321357",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
