import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://buzztrip.co/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://buzztrip.co/legal/privacy",
      lastModified: new Date("2024-12-08"),
    },
    {
      url: "https://buzztrip.co/legal/terms",
      lastModified: new Date("2024-12-08"),
    },
  ];
}
