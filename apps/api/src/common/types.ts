import { OpenAPIHono } from "@hono/zod-openapi";

export interface Env {
  AUTH_SECRET: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  TURSO_CONNECTION_URL: string;
  TURSO_AUTH_TOKEN: string;
  API_URL: string;
  API_SECRET_KEY: string;
  FRONT_END_URL: string;
  SENTRY_DSN: string;
  RESEND_API_KEY: string;
  R2_ACCESS_ID: string;
  R2_ACCESS_KEY: string;
  R2_BUCKET: string;
  R2_ENDPOINT: string;
  R2_PUBLIC_URL: string;
  MICROSOFT_CLIENT_ID: string;
  MICROSOFT_CLIENT_SECRET: string;
  POLAR_ACCESS_TOKEN: string;
  ENVIRONMENT: string;
  MAPS_DURABLE_OBJECT: DurableObjectNamespace;
  BUZZTRIP_BUCKET: R2Bucket;
  AI: Ai;
}

export interface AppBindings {
  Bindings: Env;
}

export const app = new OpenAPIHono<AppBindings>();
