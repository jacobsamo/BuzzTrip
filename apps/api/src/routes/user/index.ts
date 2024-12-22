import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../common/bindings";
import { getUserMapsHandler } from "./user.handler";
import { getUserMapsRoute } from "./user.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app.openapi(getUserMapsRoute, getUserMapsHandler);

export default routes;
