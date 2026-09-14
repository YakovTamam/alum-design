import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { SERVICE_PAGE_SLUGS } from "@/lib/service-pages";
import { getPortfolioItems } from "@/lib/portfolio-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const items = await getPortfolioItems();
    projectEntries = items.map((item) => ({
      url: `${SITE_URL}/projects/${item._id}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch (err) {
    console.error("Failed to load portfolio items for sitemap", err);
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectEntries,
    ...SERVICE_PAGE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/services/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/accessibility`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
