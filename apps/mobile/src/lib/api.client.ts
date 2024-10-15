import type { AppType } from "@buzztrip/api/src";
import { hc } from "hono/client";

export const apiClient = hc<AppType>(process.env.EXPO_PUBLIC_API_URL!, {
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_SECRET!}`,
  },
});
