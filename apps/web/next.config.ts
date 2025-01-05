import type { NextConfig } from "next";
import "./env";
import { env } from "./env";
import { withSentryConfig } from "@sentry/nextjs";
import createMDX from '@next/mdx'
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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
  },
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withSentryConfig(withMDX(nextConfig), {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,
  authToken: env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  telemetry: false,
  disableLogger: true,
  hideSourceMaps: true,
  sourcemaps: {
    disable: true,
  },
  automaticVercelMonitors: true,
});
