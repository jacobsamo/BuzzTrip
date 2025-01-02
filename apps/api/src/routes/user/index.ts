import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../common/bindings";
import { getUserMapsHandler, searchUserHandler } from "./user.handler";
import { getUserMapsRoute, searchUserRoute } from "./user.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(getUserMapsRoute, getUserMapsHandler)
  .openapi(searchUserRoute, searchUserHandler);

export default routes;
