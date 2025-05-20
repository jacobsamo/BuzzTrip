import { sentry } from "@hono/sentry";
import { withSentry } from "@sentry/cloudflare";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { app, Env } from "./common/types";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";
import { routes } from "./routes";
import { authHandler } from "./routes/auth";
import { connectRealtimeMapRoute } from "./routes/map/connect-realtime-map";
export { MapsDurableObject } from "./durable-objects/maps-do";

app.use("*", (c, next) => {
  if (c.req.header("Origin") == c.env.FRONT_END_URL) {
    return cors({
      origin: [c.env.FRONT_END_URL, c.env.API_URL], // Front end url for cors
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
app.use(loggingMiddleware);
app.use("*", requestId());

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

app.doc("/openapi", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "BuzzTrip API",
  },
});
app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: { title: "BuzzTrip API", version: "1" },
}); // schema object

// Routes
app.get("/health", (c) => {
  return c.json({ status: "ok" }, 200);
});

// routes note needed in type inference
const noTypeInferenceRoutes = [authHandler, connectRealtimeMapRoute];

// routes for type inference

// initialize routes
routes.forEach((route) => app.route("/", route));
noTypeInferenceRoutes.forEach((route) => app.route("/", route));

export default withSentry<Env>(
  (env) => ({
    dsn: env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    environment: `api-${env.ENVIRONMENT}`,
    enabled: env.SENTRY_DSN ? true : false,
  }),
  app
);
