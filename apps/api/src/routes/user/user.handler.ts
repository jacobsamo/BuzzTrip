import { createDb } from "@buzztrip/db";
import {
  getUser,
  getUserMaps,
  searchUsers,
  updateUser,
} from "@buzztrip/db/queries";
import { AppRouteHandler } from "../../common/types";
import {
  getUserMapsRoute,
  searchUserRoute,
  updateUserRoute,
} from "./user.routes";

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

export const updateUserHandler: AppRouteHandler<
  typeof updateUserRoute
> = async (c) => {
  try {
    const { userId } = c.req.valid("param");
    const updateData = await c.req.valid("json");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const user = await getUser(db, userId);

    if (!user) {
      return c.json(
        {
          code: "user_not_found",
          message: "User not found",
          requestId: c.get("requestId"),
        },
        404
      );
    }

    const updatedUser = await updateUser(db, userId, updateData);

    if (!updatedUser) {
      return c.json(
        {
          code: "update_failed",
          message: "Failed to update user",
          requestId: c.get("requestId"),
        },
        400
      );
    }

    return c.json(updatedUser, 200);
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_request",
        message: "Failed to update user",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};
