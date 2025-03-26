export interface Bindings {
  AUTH_SECRET: string;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  API_URL: string;
  API_SECRET_KEY: string;
  FRONT_END_URL: string;
  SENTRY_DSN: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  RESEND_API_KEY: string;
}

export interface AppBindings {
  Bindings: Bindings;
}
