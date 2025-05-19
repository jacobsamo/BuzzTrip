import { hc } from "hono/client";
import type { Auth, Session, User } from "./common/auth";
import type { AppType as InternalAppType } from "./routes";

export type AppType = InternalAppType;
export type { Auth, Session, User };

const client = hc<AppType>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
