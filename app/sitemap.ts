import type { MetadataRoute } from "next";

const siteUrl = "https://www.hbiventures.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/innovation-foundry`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/innovation-foundry/virtual-front-desk`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/portfolio`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/foundation`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
