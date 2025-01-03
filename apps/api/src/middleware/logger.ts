import type { MiddlewareHandler } from "hono";
import { getPath } from "hono/utils/url";

export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const { method } = c.req;
    const path = getPath(c.req.raw);

    console.info("Incoming request", {
      requestId: c.get("requestId"),
      request: {
        method,
        path,
      },
    });

    const start = Date.now();

    await next();

    const { status } = c.res;

    if (status !== 200) {
      const extraData = {
        request: {
          method: method,
          url: path,
          headers: c.req.header(),
          body: c.req.json(),
        },
        response: {
          status: c.res.status,
          headers: c.res.headers,
          body: c.res.body,
        },
        method: method,
        json: c.req.json(),
        path: path,
        start: start,
        time: time(start),
        err: c.error,
      };

      c.get("sentry").captureMessage(
        `Failed request: ${method} ${path}, ${c.get("requestId")}`,
        "warning",
        {
          data: extraData,
        }
      );
      console.warn(
        `Failed request: ${method} ${path}, ${c.get("requestId")}`,
        extraData
      );
    } else {
      console.info("Request completed", {
        requestId: c.get("requestId"),
        request: {
          method,
          path,
        },
        response: {
          status,
          ok: String(c.res.ok),
          time: time(start),
        },
      });
    }
  } catch (err) {
    c.get("sentry").captureException(err, {
      data: {
        request: {
          method: c.req.method,
          url: c.req.path,
          headers: c.req.header(),
          body: c.req.json(),
        },
        response: {
          status: c.res.status,
          headers: c.res.headers,
          body: c.res.body,
        },
        method: c.req.method,
        json: c.req.json(),
        path: c.req.path,
        err: c.error,
      },
    });
    console.error("Error in request handling:", err);
    throw err; // Re-throw error for further handling
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
