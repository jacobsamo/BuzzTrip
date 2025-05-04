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
  MICROSOFT_CLIENT_ID: string;
  MICROSOFT_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
  R2_ENDPOINT: string;
  R2_ACCESS_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_PUBLIC_URL: string;
}

export interface AppBindings {
  Bindings: Bindings;
}
