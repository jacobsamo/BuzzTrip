import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { Bindings } from "hono/types";
import userRoutes from "./routes/user";
import mapRoutes from "./routes/map";
import {
  authMiddleware,
  loggingMiddleware,
  securityMiddleware,
} from "./middleware";

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

app.route("/users", userRoutes).route("/maps", mapRoutes);

app.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
});



export default app;
