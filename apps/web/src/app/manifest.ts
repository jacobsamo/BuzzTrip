import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BuzzTrip",
    short_name: "buzztrip",
    id: "buzztrip",
    lang: "en",
    description:
      "BuzzTrip the collaborative cross-platform highly customisable mapping platform",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/logos/logo_x48.png",
        type: "image/png",
        sizes: "48x48",
        purpose: "any",
      },
      {
        src: "/logos/logo_x72.png",
        type: "image/png",
        sizes: "72x72",
        purpose: "any",
      },
      {
        src: "/logos/logo_x96.png",
        type: "image/png",
        sizes: "96x96",
        purpose: "any",
      },
      {
        src: "/logos/logo_x128.png",
        type: "image/png",
        sizes: "128x128",
        purpose: "any",
      },
      {
        src: "/logos/logo_rounded_x256.png",
        type: "image/png",
        sizes: "256x256",
        purpose: "any",
      },
      {
        src: "/logos/logo_x384.png",
        type: "image/png",
        sizes: "384x384",
        purpose: "any",
      },
      {
        src: "/logos/logo_x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/logos/logo_x1024.png",
        type: "image/png",
        sizes: "1024x1024",
        purpose: "any",
      },
    ],
  };
}
