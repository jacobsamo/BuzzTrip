import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sign-in", "/sign-up", "/app"],
    },
    sitemap: ["https://buzztrip.co/sitemap.xml"],
  };
}
