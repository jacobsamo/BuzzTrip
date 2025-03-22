import { sentry } from "@hono/sentry";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { Bindings } from "./common/bindings";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";
import { authHandler } from "./routes/auth";
import mapRoutes from "./routes/map";
import collectionRoutes from "./routes/map/collection";
import markerRoutes from "./routes/map/marker";
import userRoutes from "./routes/user";
import authRoutes from "./routes/webhooks/auth";

const app = new OpenAPIHono<{ Bindings: Bindings }>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json({ success: false, errors: result.error.errors }, 422);
    }
  },
});

app.use("*", (c, next) => {
  if (c.req.header("Origin") == c.env.FRONT_END_URL) {
    return cors({
      origin: c.env.FRONT_END_URL, // Front end url for cors
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
      allowHeaders: ["Content-Type", "Authorization"], // Allow specific headers
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })(c, next);
  }
  return cors({
    origin: "*", // Allow all origins
    allowMethods: ["GET", "POST"],
  })(c, next);
});

app.use(authMiddleware);
app.use(securityMiddleware);
app.use((c, next) =>
  sentry({ dsn: c.env.SENTRY_DSN, tracesSampleRate: 1.0, environment: "api" })(
    c,
    next
  )
);
app.use(loggingMiddleware);
app.use("*", requestId());

app.onError((e, c) => {
  c.get("sentry").captureException(e);
  return c.text("Internal Server Error", 500);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

app.route("/", authRoutes);
app.route("/", authHandler);

const routes = app
  .route("/", userRoutes)
  .route("/", mapRoutes)
  .route("/", markerRoutes)
  .route("/", collectionRoutes);

// Export any neccariy items for either build or other apps
export { createAuth } from "./common/auth";

export type AppType = typeof routes;
export default app;
