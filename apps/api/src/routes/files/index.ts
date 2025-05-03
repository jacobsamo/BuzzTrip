import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../common/bindings";
import { uploadFileHandler } from "./files.handlers";
import { uploadFileRoute } from "./files.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app.openapi(uploadFileRoute, uploadFileHandler);

export default routes;
