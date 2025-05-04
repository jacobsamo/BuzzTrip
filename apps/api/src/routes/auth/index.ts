import { Hono } from "hono";
import { createAuth } from "../../common/auth";
import { AppBindings } from "../../common/bindings";

// Handler
const app = new Hono<AppBindings>();

export const authHandler = app.on(["POST", "GET"], "/auth/*", (c) => {
  const auth = createAuth(
    c.env.API_URL,
    c.env.FRONT_END_URL,
    c.env.AUTH_SECRET,
    c.env.GOOGLE_CLIENT_ID,
    c.env.GOOGLE_CLIENT_SECRET,
    c.env.MICROSOFT_CLIENT_ID,
    c.env.MICROSOFT_CLIENT_SECRET ,
    c.env.TURSO_CONNECTION_URL,
    c.env.TURSO_AUTH_TOKEN,
    c.env.RESEND_API_KEY
  );

  return auth.handler(c.req.raw);
});
