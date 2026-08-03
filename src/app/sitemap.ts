import type { MetadataRoute } from "next";

const SITE_URL = "https://www.djscodeai.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...["about", "team", "projects", "events", "contact"].map((slug) => ({
      url: `${SITE_URL}/#${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
