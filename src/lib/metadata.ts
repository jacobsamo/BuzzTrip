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
  description = "BuzzTrip the easiest way to plan where you go",
  image = "/images/landing-page.jpg",
  url = "https://buzztrip.co",
  noIndex = false,
  keywords = ["maps", "map", ""],
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
        name: "my maps",
        url: url,
      },
    ],
    openGraph: {
      type: "website",
      locale: "en_AU",
      title,
      description,
      images: {
        url: image || "/images/landing-page.jpg",
        alt: title,
      },
      url: url,
      siteName: "my maps",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: image || "/images/landing-page.jpg",
      creator: "@buzz_trip_app",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/icons/icon-128.jpg",
      apple: "/icons/icon-128.jpg",
    },
    metadataBase: new URL(url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    manifest: `/manifest.json`,
    keywords: keywords,
  };
}
