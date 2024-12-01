import type { AppType } from "@buzztrip/api/src";
import { env } from "env";
import { hc } from "hono/client";

export const apiClient = hc<AppType>(env.NEXT_PUBLIC_API_URL!, {
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
  },
});
