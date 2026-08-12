import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllNews } from "@/lib/data/news";
import { getFamilies, getOrikiList } from "@/lib/data/families";
import { getPublishedEvents } from "@/lib/data/events";

const staticRoutes = [
  "/", "/our-story", "/heritage", "/heritage/traditional-institution", "/takete-ide-day",
  "/development", "/our-people", "/news", "/gallery", "/weather", "/diaspora", "/archive",
  "/archive/oral-history", "/tipu", "/families", "/families/compounds", "/families/contribute",
  "/oriki", "/oriki/contribute", "/get-involved", "/contact", "/privacy", "/terms",
  "/accessibility", "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, families, oriki, events] = await Promise.all([
    getAllNews(), getFamilies(), getOrikiList(), getPublishedEvents(),
  ]);

  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({ url: `${siteConfig.url}${route}`, lastModified: now })),
    ...news.map((a) => ({ url: `${siteConfig.url}/news/${a.slug}`, lastModified: now })),
    ...families.map((f) => ({ url: `${siteConfig.url}/families/${f.slug}`, lastModified: now })),
    ...oriki.map((o) => ({ url: `${siteConfig.url}/oriki/${o.slug}`, lastModified: now })),
    ...events.map((e) => ({ url: `${siteConfig.url}/takete-ide-day/${e.year}`, lastModified: now })),
  ];
}
