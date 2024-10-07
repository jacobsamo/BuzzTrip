import { Bindings } from "@/common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createMapHandler,
  editMapHandler,
  getMapDataHandler,
  getMapHandler,
} from "./map.handlers";
import { createMap, editMap, getMap, getMapDataRoute } from "./map.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(getMap, getMapHandler)
  .openapi(getMapDataRoute, getMapDataHandler)
  .openapi(createMap, createMapHandler)
  .openapi(editMap, editMapHandler);

export default routes;
