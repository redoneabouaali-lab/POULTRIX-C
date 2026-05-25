import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/login", "/sign-up", "/sso-callback"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/llms.txt"],
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://poultrix.abouaaliahmed.com/sitemap.xml",
  };
}
