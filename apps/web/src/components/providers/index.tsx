"use client";

import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog from "posthog-js";
import React, { useEffect } from "react";
import { Toaster } from "sonner";
import ConvexClientProvider from "./convex-client-provider";

const PostHogProvider = dynamic(() => import("./posthog"), { ssr: false });

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PostHogProvider>
        <NuqsAdapter>
          <ConvexClientProvider>
            <Toaster
              position="top-center"
              richColors={true}
              closeButton={true}
            />
            {children}
          </ConvexClientProvider>
        </NuqsAdapter>
      </PostHogProvider>
    </>
  );
};

export default Providers;
