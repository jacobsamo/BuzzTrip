import { withSentry } from "@sentry/cloudflare";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { auth } from "./common/auth";
import { AppBindings, Bindings } from "./common/types";
import { authMiddleware, loggingMiddleware } from "./middleware";
import { connectRealtimeMapRoute } from "./routes/map/connect-realtime-map";

// Maps
import { createMapRoute } from "./routes/map/create-map-route";
import { editMapRoute } from "./routes/map/edit-map-route";
import { getMapDataRoute } from "./routes/map/get-map-data-route";
import { getMapRoute } from "./routes/map/get-map-route";
import { createLabelRoute } from "./routes/map/labels/create-label-route";
import { deleteLabelRoute } from "./routes/map/labels/delete-map-label";
import { getMapLabelsRoute } from "./routes/map/labels/get-map-labels";
import { updateLabelRoute } from "./routes/map/labels/update-map-label";
import { createMapUserRoute } from "./routes/map/map-user/create-map-user-route";
import { deleteMapUserRoute } from "./routes/map/map-user/delete-map-user";
import { getMapUserRoute } from "./routes/map/map-user/get-map-users";
import { updateMapUserRoute } from "./routes/map/map-user/update-map-user";
// Collections
import { createCollectionRoute } from "./routes/map/collection/create-collection-route";
import { editCollectionRoute } from "./routes/map/collection/edit-collection-route";
// Markers
import { createMarkerRoute } from "./routes/map/marker/create-marker-route";
import { editMarkerRoute } from "./routes/map/marker/edit-marker-route";
//Uploads
import { uploadFileRoute } from "./routes/upload/upload-file-route";
// Users
import { OpenAPIHono } from "@hono/zod-openapi";
import { getUserMapsRoute } from "./routes/user/get-user-maps-route";
import { searchUserRoute } from "./routes/user/search-user-route";
import { updateUserRoute } from "./routes/user/update-user-route";

export { MapsDurableObject } from "./durable-objects/maps-do";

/**
 * DO NOT CHANGE THIS TO BE THE IMPORTED VERSION FROM ./common/types
 * This will break the app stopping middleware running on the OpenAPI routes
 * commit: c0723edf3e71f7df0bdfbfea0fd6b06695bd8b66
 * github: https://github.com/jacobsamo/BuzzTrip/commit/c0723edf3e71f7df0bdfbfea0fd6b06695bd8b66
 */
const app = new OpenAPIHono<AppBindings>();

app.use("/*", async (c, next) => {
  try {
    await next();
  } catch (error: any) {
    if (error.message.includes("CORS")) {
      return c.json(
        {
          error: "CORS Error",
          message: "Origin not allowed",
        },
        403
      );
    }
    throw error;
  }
});

app.use("*", (c, next) => {
  if (c.req.header("Origin") == c.env.FRONT_END_URL) {
    return cors({
      origin: [c.env.FRONT_END_URL, c.env.API_URL], // Front end url for cors
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })(c, next);
  }

  return cors()(c, next);
});

app.use(logger());

app.use(authMiddleware);
// app.use(securityMiddleware);
app.use(loggingMiddleware);
app.use("*", requestId());

// app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
//   type: "http",
//   scheme: "bearer",
// });

// app.doc("/openapi", {
//   openapi: "3.1.0",
//   info: {
//     version: "1.0.0",
//     title: "BuzzTrip API",
//   },
// });
// app.getOpenAPI31Document({
//   openapi: "3.1.0",
//   info: { title: "BuzzTrip API", version: "1" },
// }); // schema object

// Routes
app.get("/health", (c) => {
  return c.json({ status: "ok" }, 200);
});

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/", connectRealtimeMapRoute);

const routes = app
  .route("/", getUserMapsRoute)
  .route("/", searchUserRoute)
  .route("/", updateUserRoute)
  .route("/", uploadFileRoute)
  .route("/", createMapRoute)
  .route("/", editMapRoute)
  .route("/", getMapDataRoute)
  .route("/", getMapRoute)
  .route("/", createMapUserRoute)
  .route("/", getMapUserRoute)
  .route("/", deleteMapUserRoute)
  .route("/", updateMapUserRoute)
  .route("/", createLabelRoute)
  .route("/", getMapLabelsRoute)
  .route("/", updateLabelRoute)
  .route("/", deleteLabelRoute)
  .route("/", createMarkerRoute)
  .route("/", editMarkerRoute)
  .route("/", createCollectionRoute)
  .route("/", editCollectionRoute);

export default withSentry<Bindings>(
  (env) => ({
    dsn: env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    environment: `api-${env.ENVIRONMENT}`,
    enabled: env.SENTRY_DSN ? true : false,
  }),
  app
);

export type AppType = typeof routes;
