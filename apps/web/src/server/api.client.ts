import { hcWithType } from "@buzztrip/api/client";
import { env } from "env";

export const apiClient = hcWithType(env.NEXT_PUBLIC_API_URL, {
  headers: {
    Authorization: `Bearer ${env.NEXT_PUBLIC_API_SECRET_KEY}`,
  },
  // fetch: ((input, init) => {
  //   return fetch(input, {
  //     ...init,

  //   });
  // }) satisfies typeof fetch,
});
