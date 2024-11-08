import type { Env } from "hono";

export interface Bindings {
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  API_SECRET_KEY: string;
}

export interface AppBindings {
  Bindings: Bindings;
}
