import { clerkMiddleware } from "@hono/clerk-auth";
import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
import { Bindings } from "hono/types";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";
import mapRoutes from "./routes/map";
import userRoutes from "./routes/user";
import markerRoutes from "./routes/map/marker";
import collectionRoutes from "./routes/map/collection";

const app = new OpenAPIHono<{ Bindings: Bindings }>({
  defaultHook: (result, c) => {
    console.log(result);
    if (!result.success) {
      return c.json({ success: false, errors: result.error.errors }, 422);
    }
  },
});

app.use("*", requestId());
app.use(authMiddleware);
app.use(securityMiddleware);
app.use(loggingMiddleware);
app.use("*", clerkMiddleware());

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

const routes = [userRoutes, mapRoutes, markerRoutes, collectionRoutes] as const;

routes.forEach((route) => app.route("/", route));

export type AppType = typeof routes[number];
export default app;