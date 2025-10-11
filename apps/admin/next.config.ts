import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  transpilePackages: ["@buzztrip/backend", "@buzztrip/ui"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
