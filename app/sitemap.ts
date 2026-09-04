import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllNews } from "@/lib/data/news";
import { getFamilies, getOrikiList } from "@/lib/data/families";
import { getPublishedEvents } from "@/lib/data/events";
import { getPeople } from "@/lib/data/people";
import { getProjects } from "@/lib/data/projects";
import { getArchiveItems } from "@/lib/data/archive";

const staticRoutes = [
  "/", "/our-story", "/heritage", "/heritage/faith", "/heritage/faith/first-baptist-church",
  "/heritage/agado", "/heritage/ate", "/heritage/agbagba-ide", "/heritage/takete-ide-anthem",
  "/heritage/traditional-institution", "/heritage/traditional-marriage", "/takete-ide-day",
  "/development", "/our-people", "/news", "/events", "/gallery", "/weather", "/diaspora", "/archive",
  "/archive/oral-history", "/tipu", "/tipu/branches", "/tipu/branches/lokoja",
  "/tipu/branches/ilorin", "/diaspora/uk-europe", "/takete-ide-day/cultural-attire", "/centenary", "/support",
  "/education", "/kogi-quest",
  "/development/community-at-work", "/families", "/families/compounds", "/families/contribute",
  "/oriki", "/oriki/contribute", "/get-involved", "/contact", "/privacy", "/terms",
  "/accessibility", "/cookies",
];

/**
 * Every entry comes from a data function that already filters to published,
 * publicly accessible rows — getOrikiList also requires publication_permission,
 * and getArchiveItems requires access_level = 'public'. Nothing unpublished can
 * reach the sitemap without one of those guards being removed first.
 *
 * /search is deliberately absent: it is marked noindex, and query-string result
 * pages would only dilute the canonical section pages.
 */
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, families, oriki, events, people, projects, archive] = await Promise.all([
    getAllNews(),
    getFamilies(),
    getOrikiList(),
    getPublishedEvents(),
    getPeople(),
    getProjects(),
    getArchiveItems(),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
    })),
    ...news.map((a) => ({
      url: `${siteConfig.url}/news/${a.slug}`,
      ...(a.published_at ? { lastModified: new Date(a.published_at) } : {}),
    })),
    ...families.map((f) => ({
      url: `${siteConfig.url}/families/${f.slug}`,
    })),
    ...oriki.map((o) => ({
      url: `${siteConfig.url}/oriki/${o.slug}`,
    })),
    ...events.map((e) => ({
      url: `${siteConfig.url}/takete-ide-day/${e.year}`,
      ...(e.event_date ? { lastModified: new Date(e.event_date) } : {}),
    })),
    ...people.map((p) => ({
      url: `${siteConfig.url}/our-people/${p.slug}`,
    })),
    ...projects.map((p) => ({
      url: `${siteConfig.url}/development/projects/${p.slug}`,
    })),
    ...archive.map((a) => ({
      url: `${siteConfig.url}/archive/${a.slug}`,
    })),
  ];
}
