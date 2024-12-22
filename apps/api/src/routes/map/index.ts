import { Bindings } from "../../common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createMapHandler,
  editMapHandler,
  getMapDataHandler,
  getMapHandler,
} from "./map.handlers";
import { createMapRoute, editMapRoute, getMapRoute, getMapDataRoute } from "./map.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(getMapRoute, getMapHandler)
  .openapi(getMapDataRoute, getMapDataHandler)
  .openapi(createMapRoute, createMapHandler)
  .openapi(editMapRoute, editMapHandler);

export default routes;
