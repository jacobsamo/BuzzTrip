import * as schema from "@/server/db/schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "env";

const client = createClient({
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: schema,
  logger: process.env.NODE_ENV === "development",
});
