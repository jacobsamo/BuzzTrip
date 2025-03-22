import { Hono } from "hono";
import { AppBindings } from "src/common/bindings";
import { createAuth } from "src/common/auth";

// Handler
const app = new Hono<AppBindings>();

export const authHandler = app.on(["POST", "GET"], "/api/auth/*", (c) => {
  const auth = createAuth(
    c.env.FRONT_END_URL,
    c.env.AUTH_SECRET,
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    c.env.TURSO_CONNECTION_URL,
    c.env.TURSO_AUTH_TOKEN
  );

  return auth.handler(c.req.raw);
});
