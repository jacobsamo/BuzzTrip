import type {
  Ai,
  DurableObjectNamespace,
  R2Bucket,
} from "@cloudflare/workers-types";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { RequestIdVariables } from 'hono/request-id'
import type { SecureHeadersVariables } from 'hono/secure-headers'

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
  ENVIRONMENT: "production" | "development";
  MAPS_DURABLE_OBJECT: DurableObjectNamespace;
  BUZZTRIP_BUCKET: R2Bucket;
  AI: Ai;
}

type StringifyValues<EnvType extends Record<string, unknown>> = {
  [Binding in keyof EnvType]: EnvType[Binding] extends string
    ? EnvType[Binding]
    : string;
};

declare namespace NodeJS {
  interface ProcessEnv
    extends StringifyValues<
      Omit<Env, "MAPS_DURABLE_OBJECT" | "BUZZTRIP_BUCKET" | "AI">
    > {}
}

export interface AppBindings {
  Bindings: Env;
  Variables: RequestIdVariables;
}

export const app = new OpenAPIHono<AppBindings>();
