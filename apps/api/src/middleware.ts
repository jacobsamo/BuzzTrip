import type { Context, MiddlewareHandler, Next } from "hono";
import { env } from "hono/adapter";
import { bearerAuth } from "hono/bearer-auth";
import { secureHeaders } from "hono/secure-headers";

const PUBLIC_PATHS = ["/", "/health", "/webhook", "/webhook/auth"];

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

    if (c.res.status !== 200) {
      c.get("sentry").captureMessage(
        `Failed request: ${c.req.method} ${c.req.url}, ${c.get("requestId")}`,
        "warning",
        {
          data: {
            request: {
              method: c.req.method,
              url: c.req.url,
              headers: c.req.header,
              body: c.req.json,
            },
            response: {
              status: c.res.status,
              headers: c.res.headers,
              body: c.res.body,
            },
            err: c.error,
          },
        }
      );
      console.log(
        `Failed request: ${c.req.method} ${c.req.url}, ${c.get("requestId")}`,
        {
          req: c.req,
          res: c.res,
          method: c.req.method,
          json: c.req.json(),
        }
      );
    }
  } catch (err) {
    c.get("sentry").captureException(err);
    console.error("Error in request handling:", err);
    throw err; // Re-throw error for further handling
  }
};

export { authMiddleware, loggingMiddleware, securityMiddleware };
