import { AppRouteHandler } from "../../common/types";
import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { getUserMapsRoute, searchUserRoute } from "./user.routes";
import { searchUsers } from "@buzztrip/db/queries";

export const getUserMapsHandler: AppRouteHandler<
  typeof getUserMapsRoute
> = async (c) => {
  try {
    const { userId } = c.req.valid("param");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const usersMaps = await getUserMaps(db, userId);

    return c.json(usersMaps, 200);
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_request",
        message: "Failed to get user maps",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};

export const searchUserHandler: AppRouteHandler<
  typeof searchUserRoute
> = async (c) => {
  try {
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
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            full_name: user.full_name,
            profile_picture: user.profile_picture,
          };
        }),
      },
      200
    );
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_request",
        message: "Failed to search user",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};
