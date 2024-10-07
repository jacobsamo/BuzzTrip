import { Bindings } from "@/common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  createCollectionHandler,
  editCollectionHandler,
} from "./collection.handlers";
import { createCollection, editCollection } from "./collection.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(createCollection, createCollectionHandler)
  .openapi(editCollection, editCollectionHandler);

export default routes;
