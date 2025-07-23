import { getBlogPosts } from "@/lib/blog";
import type { MetadataRoute } from "next";

export const baseUrl = "https://buzztrip.co";

type RawRoute = string | { url: string; lastModified?: Date };

const rawRoutes: RawRoute[] = [
  "",
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

type SiteMapItem = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Blog routes to be defined here
  const posts = getBlogPosts();
  const blogRoutes = posts.map(
    (post) =>
      ({
        url: `/blog/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        images: [post.metadata.image],
      }) satisfies SiteMapItem
  );

  const routes = rawRoutes.map((route) => {
    const url = typeof route === "string" ? route : route.url;
    const lastModified =
      (typeof route === "string" ? undefined : route.lastModified) ??
      new Date();

    return {
      url,
      lastModified: lastModified.toISOString().split("T")[0],
    } satisfies SiteMapItem;
  });

  return [...routes, ...blogRoutes];
}
