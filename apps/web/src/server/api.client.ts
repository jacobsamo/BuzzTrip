import { hcWithType } from "@buzztrip/api/types";
import { env } from "env";

export const apiClient = hcWithType(env.NEXT_PUBLIC_API_URL, {
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
  },
});
