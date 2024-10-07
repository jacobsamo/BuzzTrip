import { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { AppBindings } from "./bindings";

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
