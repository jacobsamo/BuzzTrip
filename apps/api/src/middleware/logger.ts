import type { MiddlewareHandler } from "hono";
import { getPath } from "hono/utils/url";

export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  const { method } = c.req;
  const path = getPath(c.req.raw);
  const requestId = c.get("requestId");
  const start = Date.now();

  // Read request body safely (clone if needed)
  let requestBodyText: string | undefined;

  try {
    if (c.req.header("content-type")?.includes("application/json")) {
      requestBodyText = await c.req.text(); // Only read once
      c.set("parsedJsonBody", JSON.parse(requestBodyText)); // store parsed value
    }
  } catch (e) {
    requestBodyText = "<unreadable>";
  }

  // Use this in logging
  const requestBody = requestBodyText && requestBodyText !== "<unreadable>"
    ? JSON.parse(requestBodyText)
    : requestBodyText;

  // Log incoming request with as much context as possible
  console.info("[Request]", {
    requestId,
    method,
    path,
    headers: c.req.header(),
    body: requestBody,
    honoContext: {
      params: c.req.param(),
      query: c.req.query(),
      url: c.req.url,
      path: c.req.path,
      routePath: c.req.routePath,
      matchedRoutes: c.req.matchedRoutes,
      env: c.env,
    },
  });

  try {
    await next();
    const { status } = c.res;
    let responseBodyText: string | undefined;

    try {
      if (c.req.header("content-type")?.includes("application/json")) {
        responseBodyText = await c.req.text(); // Only read once
        c.set("parsedJsonBody", JSON.parse(responseBodyText)); // store parsed value
      }
    } catch (e) {
      responseBodyText = "<unreadable>";
    }

    // Use this in logging
    const responseBody = responseBodyText && responseBodyText !== "<unreadable>"
      ? JSON.parse(responseBodyText)
      : responseBodyText;

    const logData = {
      requestId,
      method,
      path,
      status,
      duration: time(start),
      request: { headers: c.req.header(), body: requestBody },
      response: {
        headers: Object.fromEntries(c.res.headers.entries()),
        body: responseBody,
      },
      honoContext: {
        params: c.req.param(),
        query: c.req.query(),
        url: c.req.url,
        path: c.req.path,
        routePath: c.req.routePath,
        matchedRoutes: c.req.matchedRoutes,
        env: c.env,
      },
    };

    if (status !== 200) {
      c
        .get("sentry")
        ?.captureMessage(
          `[Non-200] ${method} ${path} (${status}) [${requestId}]`,
          "warning",
          { data: logData }
        );
      console.warn("[Non-200 Response]", logData);
    } else {
      console.info("[Response]", logData);
    }
  } catch (err: any) {
    // Log error with stack trace and context
    const errorLog = {
      requestId,
      method,
      path,
      error: err?.message,
      stack: err?.stack,
      request: { headers: c.req.header(), body: requestBody },
      honoContext: {
        params: c.req.param(),
        query: c.req.query(),
        url: c.req.url,
        path: c.req.path,
        routePath: c.req.routePath,
        matchedRoutes: c.req.matchedRoutes,
        env: c.env,
      },
    };
    c.get("sentry")?.captureException(err, { data: errorLog });
    console.error("[Request Error]", errorLog);
    throw err;
  }
};

function humanize(times: string[]): string {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter)
  );

  return orderTimes.join(separator);
}

function time(start: number): string {
  const delta = Date.now() - start;
  return humanize([
    delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s",
  ]);
}
