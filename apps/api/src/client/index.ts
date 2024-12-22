import type { AppType } from "..";
import { hc } from "hono/client";

export const client = (url: string, key: string) =>
  hc<AppType>(url, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
