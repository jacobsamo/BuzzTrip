import { client } from "@buzztrip/api/src/client";
import { env } from "env";

export const apiClient = client(
  env.NEXT_PUBLIC_API_URL,
  env.NEXT_PUBLIC_API_URL
);
