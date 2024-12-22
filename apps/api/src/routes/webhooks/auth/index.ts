import { Bindings } from "../../../common/bindings";
import { OpenAPIHono } from "@hono/zod-openapi";
import { clerkWebhookHandler } from "./auth.handler";
import { clerkWebhookRoute } from "./auth.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app.openapi(clerkWebhookRoute, clerkWebhookHandler);

export default routes;
