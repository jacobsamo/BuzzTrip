import { Bindings } from "@/common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import { createMarkerHandler, editMarkerHandler } from "./marker.handlers";
import { createMarkerRoute, editMarkerRoute } from "./marker.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(createMarkerRoute, createMarkerHandler)
  .openapi(editMarkerRoute, editMarkerHandler);

export default routes;
