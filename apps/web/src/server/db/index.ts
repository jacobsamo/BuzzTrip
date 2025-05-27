import "server-only";
import { env } from "env";
import { createDb } from "@buzztrip/db";

export const db = createDb(env.TURSO_CONNECTION_URL, env.TURSO_AUTH_TOKEN, process.env.ENVIRONMENT === "production");
