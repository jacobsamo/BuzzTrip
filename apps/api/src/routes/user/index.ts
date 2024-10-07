import { Bindings } from "@/common/bindings";
import { ErrorSchema } from "@/common/schema";
import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { MapsParamsSchema, MapsSchema } from "./schema";
import { getUserMapsRoute } from "./user.routes";
import { getUserMapsHandler } from "./user.handler";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app.openapi(getUserMapsRoute, getUserMapsHandler);

export default routes;
