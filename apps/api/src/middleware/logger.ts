import { captureException, captureMessage } from "@sentry/cloudflare";
import type { MiddlewareHandler } from "hono";
import { getPath } from "hono/utils/url";

export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  const { method } = c.req;
  const originalRequest = c.req.raw;
  const clonedRequest = originalRequest.clone();
  const path = getPath(originalRequest);
  const requestId = c.get("requestId");
  const start = Date.now();

  let requestBodyText: string | undefined;
  try {
    if (
      originalRequest.headers.get("content-type")?.includes("application/json")
    ) {
      requestBodyText = await clonedRequest.text(); // Safe because it's cloned
      c.set("parsedJsonBody", JSON.parse(requestBodyText)); // Store parsed value
    }
  } catch (e) {
    requestBodyText = "<unreadable>";
  }

  const requestBody =
    requestBodyText && requestBodyText !== "<unreadable>"
      ? JSON.parse(requestBodyText)
      : requestBodyText;

  console.info("[Request]", {
    requestId,
    method,
    path,
    headers: Object.fromEntries(originalRequest.headers.entries()),
    body: requestBody,
    honoContext: {
      params: c.req.param(),
      query: c.req.query(),
      url: c.req.url,
      path: c.req.path,
      routePath: c.req.routePath,
    },
  });

  try {
    await next();

    const { status } = c.res;
    const responseHeaders = Object.fromEntries(c.res.headers.entries());

    const logData = {
      requestId,
      method,
      path,
      status,
      duration: time(start),
      request: {
        headers: Object.fromEntries(originalRequest.headers.entries()),
        body: requestBody,
      },
      response: {
        headers: responseHeaders,
        body: "<unavailable>", // Skip reading response stream to avoid side effects
      },
      honoContext: {
        params: c.req.param(),
        query: c.req.query(),
        url: c.req.url,
        path: c.req.path,
        routePath: c.req.routePath,
      },
    };

    if (status !== 200) {
      captureMessage(`[Non-200] ${method} ${path} (${status}) [${requestId}]`, {
        level: "warning",
        extra: {
          data: logData,
        },
      });
      console.warn("[Non-200 Response]", logData);
    } else {
      console.info("[Response]", logData);
    }
  } catch (err: any) {
    const errorLog = {
      requestId,
      method,
      path,
      error: err?.message,
      stack: err?.stack,
      request: {
        headers: Object.fromEntries(originalRequest.headers.entries()),
        body: requestBody,
      },
      honoContext: {
        params: c.req.param(),
        query: c.req.query(),
        url: c.req.url,
        path: c.req.path,
        routePath: c.req.routePath,
        matchedRoutes: c.req.matchedRoutes,
      },
    };
    captureException(err, { data: errorLog });
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
