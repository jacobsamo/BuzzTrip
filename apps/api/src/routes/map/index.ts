import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../common/bindings";
import {
  createMapHandler,
  editMapHandler,
  getMapDataHandler,
  getMapHandler,
  shareMapHandler,
} from "./map.handlers";
import {
  createMapRoute,
  editMapRoute,
  getMapDataRoute,
  getMapRoute,
  shareMapRoute,
} from "./map.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(getMapRoute, getMapHandler)
  .openapi(getMapDataRoute, getMapDataHandler)
  .openapi(createMapRoute, createMapHandler)
  .openapi(editMapRoute, editMapHandler)
  .openapi(shareMapRoute, shareMapHandler);

export default routes;
