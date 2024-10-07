import type { Env } from "hono";

export type Bindings = {
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  API_SECRET_KEY: string;
};

export interface AppBindings {
  Bindings: Bindings;
}
