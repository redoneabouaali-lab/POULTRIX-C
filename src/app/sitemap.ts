import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://poultrix.abouaaliahmed.com";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/sign-up`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/dashboard/breeds`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/dashboard/overview`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/dashboard/chickens`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${baseUrl}/dashboard/eggs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${baseUrl}/dashboard/analytics`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.4 },
    { url: `${baseUrl}/dashboard/ai-vet`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
