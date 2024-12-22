import { OpenAPIHono } from "@hono/zod-openapi";
import { requestId } from "hono/request-id";
import { Bindings } from "./common/bindings";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";
import mapRoutes from "./routes/map";
import userRoutes from "./routes/user";
import markerRoutes from "./routes/map/marker";
import collectionRoutes from "./routes/map/collection";
import { cors } from "hono/cors";
import authRoutes from "./routes/webhooks/auth";

const app = new OpenAPIHono<{ Bindings: Bindings }>({
  defaultHook: (result, c) => {
    console.log(result);
    if (!result.success) {
      return c.json({ success: false, errors: result.error.errors }, 422);
    }
  },
});

app.use(
  "*",
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    allowMethods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowHeaders: ["Content-Type", "Authorization", "Cookie"], // Allow specific headers
  })
);

app.use("*", requestId());
app.use(authMiddleware);
app.use(securityMiddleware);
app.use(loggingMiddleware);

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});

const map = [mapRoutes, markerRoutes, collectionRoutes];
const user = [userRoutes];

app.route("/", authRoutes);

const routes = app
  .route("/", userRoutes)
  .route("/", mapRoutes)
  .route("/", markerRoutes)
  .route("/", collectionRoutes);

export type AppType = typeof routes;
export default app;
