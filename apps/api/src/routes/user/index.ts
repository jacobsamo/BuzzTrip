import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../common/bindings";
import {
  getUserMapsHandler,
  searchUserHandler,
  updateUserHandler,
} from "./user.handler";
import {
  getUserMapsRoute,
  searchUserRoute,
  updateUserRoute,
} from "./user.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(getUserMapsRoute, getUserMapsHandler)
  .openapi(searchUserRoute, searchUserHandler)
  .openapi(updateUserRoute, updateUserHandler);

export default routes;
