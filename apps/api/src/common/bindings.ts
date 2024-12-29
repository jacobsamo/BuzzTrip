export interface Bindings {
  CLERK_WEBHOOK_SECRET: string;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  API_SECRET_KEY: string;
  FRONT_END_URL: string;
}

export interface AppBindings {
  Bindings: Bindings;
}
