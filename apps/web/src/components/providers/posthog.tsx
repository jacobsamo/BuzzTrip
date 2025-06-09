"use client";
import { env } from "env";
import posthog from "posthog-js";
import { PostHogProvider as PostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      env.NEXT_PUBLIC_POSTHOG_KEY &&
      env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/_proxy/posthog/ingest",
        ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        enable_heatmaps: true,
        session_recording: {
          maskAllInputs: false,
          maskInputOptions: {
            password: true,
            email: true,
          },
        },
        loaded: function (ph) {
          if (
            process.env.NODE_ENV == "development" ||
            location.hostname === "localhost" ||
            location.hostname === "127.0.0.1"
          ) {
            ph.opt_out_capturing();
            ph.set_config({ disable_session_recording: true });
          }
        },
      });
    }
  }, []);

  return <PostHog client={posthog}>{children}</PostHog>;
}
