import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import {
  MapsParamsSchema,
  MapsSchema,
  SearchUserReturnSchema,
  SearchUsersSchema,
  UpdateUserReturnSchema,
  UpdateUserSchema,
} from "./schema";

export const getUserMapsRoute = createRoute({
  method: "get",
  path: "/users/{userId}/maps",
  summary: "Get all maps that a user has created or been shared",
  request: {
    params: MapsParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MapsSchema,
        },
      },
      description: "Gets all maps that a user has created or been shared",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});

export const searchUserRoute = createRoute({
  method: "get",
  path: "/users/search",
  summary: "Search for a user",
  request: {
    query: SearchUsersSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SearchUserReturnSchema,
        },
      },
      description: "Gets all maps that a user has created or been shared",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});

export const updateUserRoute = createRoute({
  method: "put",
  path: "/users/{userId}",
  summary: "Update user information",
  request: {
    params: z.object({
      userId: z.string().openapi({
        param: {
          name: "userId",
          in: "path",
          required: true,
        },
        example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: UpdateUserReturnSchema,
        },
      },
      description: "User updated successfully",
    },
    404: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "User not found",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error",
    },
  },
});
