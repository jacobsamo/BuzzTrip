import { createDb } from "@buzztrip/db";

export const db = createDb(
  process.env.TURSO_CONNECTION_URL,
  process.env.TURSO_AUTH_TOKEN
);
