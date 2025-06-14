import { Metadata } from "next";

export function constructMetadata({
  title = "BuzzTrip",
  description = "Create Custom Maps, anywhere on any device",
  image = "/assets/open-graph.jpg",
  video,
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
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
      title,
      description,
      locale: "en_AU",
      type: "website",
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    facebook: {
      appId: "1218637089558551",
    },
    keywords: [
      "travel",
      "maps",
      "mapping",
      "trip",
      "holiday",
      "planning",
      "buzztrip",
    ],
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@buzztripdotco",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/logos/logo_x128.png",
      apple: "/logos/logo_x128.png",
    },
    metadataBase: new URL("https://buzztrip.co"),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
    robots: "/robots.txt",
  };
}
