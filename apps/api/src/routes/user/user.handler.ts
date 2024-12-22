import { AppRouteHandler } from "../../common/types";
import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { getUserMapsRoute } from "./user.routes";

export const getUserMapsHandler: AppRouteHandler<
  typeof getUserMapsRoute
> = async (c) => {
  const { userId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const usersMaps = await getUserMaps(db, userId);

  return c.json(usersMaps, 200);
};
