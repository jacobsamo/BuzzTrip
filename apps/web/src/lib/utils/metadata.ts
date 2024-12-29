import { Metadata } from "next";

/**
 * Constructs a metadata object
 * @param {string | undefined} title
 * @param {string | undefined} description
 * @param {string[] | undefined} keywords
 * @param {string | undefined} image
 * @param {string | undefined} url
 * @param {boolean | undefined} noIndex
 * @returns {Metadata} a metadata object
 */
export function constructMetadata({
  title = "BuzzTrip",
  description = "Plan the trip you've always dreamed of",
  image = "/assets/open-graph.jpg",
  url = "https://buzztrip.co",
  noIndex = false,
  keywords = [
    "travel",
    "maps",
    "mapping",
    "trip",
    "holiday",
    "planning",
    "buzztrip",
  ],
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    authors: [
      {
        name: "buzztrip",
        url: url,
      },
    ],
    openGraph: {
      type: "website",
      locale: "en_AU",
      title,
      description,
      images: {
        url: image || "/assets/open-graph.jpg",
        alt: title,
      },
      url: url,
      siteName: "BuzzTrip",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: image || "/assets/open-graph.jpg",
      creator: "@buzztrip",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/logos/icon_x128.png",
      apple: "/logos/icon_x128.png",
    },
    metadataBase: new URL(url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    manifest: "/manifest.webmanifest",
    robots: "/robots.txt",
    keywords: keywords,
  };
}
