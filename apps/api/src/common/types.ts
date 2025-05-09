import { OpenAPIHono } from "@hono/zod-openapi";

export interface AppBindings {
  Bindings: Cloudflare.Env;
}

export const appRoute = new OpenAPIHono<AppBindings>();
