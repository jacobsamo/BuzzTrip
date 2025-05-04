import { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

export interface AppBindings {
  Bindings: Env;
}

export const appRoute = new OpenAPIHono<AppBindings>();
