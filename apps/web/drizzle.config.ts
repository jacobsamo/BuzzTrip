import { defineConfig } from "drizzle-kit";
import { env } from "env";

export default defineConfig({
  schema: "./src/server/db/schema",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: process.env.NODE_ENV === "production" ? {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  } : {
    url: "file:./.db/buzztrip-local.db",
  },
});
