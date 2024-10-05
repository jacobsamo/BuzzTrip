import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema",
  out: "./drizzle/migrations",
  dialect: "sqlite",
  driver: "turso",
  // dbCredentials: process.env.NODE_ENV === "production" ? {
  //   url: process.env.TURSO_CONNECTION_URL!,
  //   authToken: process.env.TURSO_AUTH_TOKEN!,
  // } : {
  //   url: "file:./buzztrip-local.db",
  // },
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
