import { AppRouteHandler } from "../../common/types";
import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { getUserMapsRoute, searchUserRoute } from "./user.routes";
import { searchUsers } from "@buzztrip/db/queries";

export const getUserMapsHandler: AppRouteHandler<
  typeof getUserMapsRoute
> = async (c) => {
  const { userId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const usersMaps = await getUserMaps(db, userId);

  return c.json(usersMaps, 200);
};

export const searchUserHandler: AppRouteHandler<
  typeof searchUserRoute
> = async (c) => {
  const query = c.req.query("q");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  if (!query) {
    return c.json({ users: null }, 200);
  }

  const users = await searchUsers(db, query);

  return c.json(
    {
      users: users.map((user) => {
        return {
          userId: user.user_id,
          email: user.email,
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          profile_picture: user.profile_picture,
        };
      }),
    },
    200
  );
};
