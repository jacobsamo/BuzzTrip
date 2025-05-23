import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./env";
import { env } from "./env";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // turbopack: {
  //   resolveExtensions: [
  //     ".md",
  //     ".mdx",
  //     ".tsx",
  //     ".ts",
  //     ".jsx",
  //     ".js",
  //     ".mjs",
  //     ".json",
  //   ],
  // },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
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
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^cloudflare:workers$|^cloudflare:*/,
      })
    );

    return config;
  },
  skipTrailingSlashRedirect: true,
  // webpack: (config) => {
  //   if (process.env.NODE_ENV === "production")
  //     config.plugins.push(ReactComponentName({}));
  //   return config;
  // },
};

const withMDX = createMDX({
  options: {
    // remarkPlugins: [['remark-gfm', { strict: true, throwOnError: true }]],
    // rehypePlugins: [],
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
  sourcemaps: {
    disable: true,
  },
  automaticVercelMonitors: true,
});
