import type { MiddlewareHandler } from "hono";
import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { secureHeaders } from "hono/secure-headers";

const PUBLIC_PATHS = [/\/$/, /\/health$/, /\/webhook\/.*/, /\/auth.*/];

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const path = c.req.path;
  if (PUBLIC_PATHS.some((regex) => regex.test(path))) {
    return next();
  }

  const { API_SECRET_KEY } = env(c);
  return bearerAuth({ token: API_SECRET_KEY })(c, next);
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

export * from "./logger";

export { authMiddleware, securityMiddleware };
