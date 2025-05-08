import { Hono } from "hono";
import { auth } from "../../common/auth";
import { AppBindings } from "../../common/types";

// Handler
const app = new Hono<AppBindings>({
  strict: false,
});

export const authHandler = app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
