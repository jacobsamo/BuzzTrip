import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
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
  experimental: {
    optimizePackageImports: ["lucide-react", "@phosphor-icons/react"],
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
