import { withSentryConfig } from "@sentry/nextjs";
import "./env.mjs";
import { env } from "./env.mjs";
import nextMdx from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  crossOrigin: "use-credentials",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "img.buzztrip.co",
      },
    ],
  },
  async rewrites() {
    return [
      // for posthog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@phosphor-icons/react",
      "posthog-js",
      "@sentry/nextjs",
    ],
    instrumentationHook: true,
  },
  skipTrailingSlashRedirect: true,
};

const withMDX = nextMdx({
  // extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,
  authToken: env.SENTRY_AUTH_TOKEN,
  telemetry: false,
  disableLogger: true,
  hideSourceMaps: true,
  sourcemaps: {
    disable: true,
  },
  automaticVercelMonitors: false,
});
