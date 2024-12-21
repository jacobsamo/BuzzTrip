import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth"],
    },
    sitemap: ["https://buzztrip.co/sitemap.xml"],
  };
}
