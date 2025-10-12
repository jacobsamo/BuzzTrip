"use client";
import { useAuth } from "@clerk/nextjs";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient, useQuery } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { env } from "env";
import { usePostHog } from "posthog-js/react";
import { ReactNode, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { api } from "@buzztrip/backend/api";

if (!env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

function UserIdentifier() {
  const posthog = usePostHog();
  const session = useAuth();
  const currentUser = useQuery(api.users.currentUser);

  // track users by id in posthog
  useEffect(() => {
    if (session?.userId && currentUser) {
      posthog.identify(session.userId, {
        clerkId: session.userId,
        convexId: currentUser._id,
        email: currentUser.email,
      });
      Sentry.setUser({
        id: session.userId,
        email: currentUser.email,
      });
    }
  }, [posthog, session, currentUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <QueryClientProvider client={queryClient}>
        <UserIdentifier />
        {children}
      </QueryClientProvider>
    </ConvexProviderWithClerk>
  );
}
