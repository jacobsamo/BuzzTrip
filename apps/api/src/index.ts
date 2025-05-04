import { sentry } from "@hono/sentry";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { AppBindings } from "./common/types";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";
import { authHandler } from "./routes/auth";
// Maps
import { createMapRoute } from "./routes/map/create-map-route";
import { editMapRoute } from "./routes/map/edit-map-route";
import { getMapDataRoute } from "./routes/map/get-map-data-route";
import { getMapRoute } from "./routes/map/get-map-route";
import { shareMapRoute } from "./routes/map/share-map-route";
// Collections
import { createCollectionRoute } from "./routes/map/collection/create-collection-route";
import { editCollectionRoute } from "./routes/map/collection/edit-collection-route";
// Markers
import { createMarkerRoute } from "./routes/map/marker/create-marker-route";
import { editMarkerRoute } from "./routes/map/marker/edit-marker-route";
//Uploads
import { uploadFileRoute } from "./routes/upload/upload-file-route";
// Users
import { getUserMapsRoute } from "./routes/user/get-user-maps-route";
import { searchUserRoute } from "./routes/user/search-user-route";
import { updateUserRoute } from "./routes/user/update-user-route";

const app = new OpenAPIHono<AppBindings>({
  defaultHook: (result, c) => {
    if (!result.success) {
      console.error("Failed request", {
        result,
        c,
      });
      return c.json({ success: false, errors: result.error.errors }, 422);
    }
  },
});

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
app.use((c, next) =>
  sentry({
    dsn: c.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: "api",
    enabled: c.env.SENTRY_DSN ? true : false,
  })(c, next)
);
app.use(loggingMiddleware);
app.use("*", requestId());


app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});


app.route("/", authHandler);

const routes = app
  // User routes
  .route("/", getUserMapsRoute)
  .route("/", searchUserRoute)
  .route("/", updateUserRoute)
  // Upload routes
  .route("/", uploadFileRoute)
  // Map routes
  .route("/", createMapRoute)
  .route("/", editMapRoute)
  .route("/", getMapDataRoute)
  .route("/", getMapRoute)
  .route("/", shareMapRoute)
  // Marker Routes
  .route("/", createMarkerRoute)
  .route("/", editMarkerRoute)
  // Collection routes
  .route("/", createCollectionRoute)
  .route("/", editCollectionRoute);

// Export any neccariy items for either build or other apps
export * from "./common/auth";

export type AppType = typeof routes;
export default app;
