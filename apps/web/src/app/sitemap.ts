import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://buzztrip.co/",
      lastModified: new Date(),
      priority: 1,
      
    },
    {
      url: "https://buzztrip.co/legal/privacy",
      lastModified: new Date("2025-12-08"),
    },
    {
      url: "https://buzztrip.co/legal/terms",
      lastModified: new Date("2025-12-08"),
    },
    {
      url: "https://buzztrip.co/about",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/roadmap",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/pricing",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/help",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/contact",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/blog",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/sign-in",
      lastModified: new Date(),
    },
    {
      url: "https://buzztrip.co/sign-up",
      lastModified: new Date(),
    },
  ];
}
