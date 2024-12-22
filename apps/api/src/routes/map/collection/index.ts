import { Bindings } from "../../../common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createCollectionHandler,
  editCollectionHandler,
} from "./collection.handlers";
import {
  createCollectionRoute,
  editCollectionRoute,
} from "./collection.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(createCollectionRoute, createCollectionHandler)
  .openapi(editCollectionRoute, editCollectionHandler);

export default routes;
