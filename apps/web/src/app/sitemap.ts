import type { MetadataRoute } from "next";

export const baseUrl = "https://buzztrip.co";

type RawRoute = string | { url: string; lastModified?: Date };

const rawRoutes: RawRoute[] = [
  "",
  "/legal/privacy",
  { url: "/legal/privacy", lastModified: new Date("2025-12-08") },
  { url: "/legal/terms", lastModified: new Date("2025-12-08") },
  "/about",
  "/roadmap",
  "/pricing",
  "/help",
  "/contact",
  "/blog",
  "/sign-in",
  "/sign-up",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Blog routes to be defined here
  
  const routes = rawRoutes.map((route) => {
    const url = typeof route === "string" ? route : route.url;
    const lastModified =
      (typeof route === "string" ? undefined : route.lastModified) ??
      new Date();

    return {
      url,
      lastModified: lastModified.toISOString().split("T")[0],
    };
  });

  return [...routes];
}
