import { Bindings } from "@/common/bindings";
import { ErrorSchema } from "@/common/schema";
import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { MapsParamsSchema, MapsSchema } from "./schema";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const mapsRoute = createRoute({
  method: "get",
  path: "/{userId}/maps",
  summary: "Get all maps that a user has created or been shared",
  request: {
    params: MapsParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MapsSchema,
        },
      },
      description: "Gets all maps that a user has created or been shared",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});

app.openapi(mapsRoute, async (c) => {
  const { userId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const usersMaps = await getUserMaps(db, userId);

  return c.json(
    {
      data: usersMaps,
    },
    200
  );
});

export default app;
