import type { Context, MiddlewareHandler, Next } from "hono";
import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

const PUBLIC_PATHS = ["/", "/health", "/webhook"];

const authMiddleware = (c: Context, next: Next) => {
  if (PUBLIC_PATHS.includes(c.req.path)) {
    return next();
  }

  const { API_SECRET_KEY } = env(c);
  const bearer = bearerAuth({ token: API_SECRET_KEY });

  return bearer(c, next);
};

// const cacheMiddleware = (c: Context, next: Next) => {
//   if (process.env.NODE_ENV === "development") {
//     return next();
//   }

//   return cache({
//     cacheName: "buzztrip",
//     cacheControl: "max-age=3600",
//   })(c, next);
// };

const securityMiddleware = secureHeaders();

const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    await next();

    console.log("req", {
      req: c.req,
      res: c.res,
      method: c.req.method,
      body: c.body,
      json: c.req.json(),
      err: c.error,
      context: c
    })
  } catch (err) {
    console.error("Error in request handling:", err);
    throw err; // Re-throw error for further handling
  }
};

export { authMiddleware, loggingMiddleware, securityMiddleware };
