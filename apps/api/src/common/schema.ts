import { mapsSchema } from "@buzztrip/db/zod-schemas";
import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
  code: z.string().openapi({
    example: "internal_server_error",
  }),
  message: z.string().openapi({
    example:
      "Internal server error",
  }),
  requestId: z.string().openapi({
    example: "123e4567-e89b-12d3-a456-426655440000",
  }),
});

export const HeadersSchema = z.object({
  authorization: z.string().openapi({
    example: "Bearer SECRET",
  }),
});


export const MapParamsSchema = z.object({
  mapId: z
    .string()
    .openapi({
      param: {
        name: "mapId",
        in: "path",
        required: true,
      },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
});

export const MapSchema = mapsSchema.openapi("MapsSchema");

export const SuccessfulDeleteSchema = z.object({
  code: z.string().openapi({
    example: "success",
  }),
  message: z.string().openapi({
    example: "User removed successfully",
  }),
  deletedId: z.string().openapi({
    example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    description: "The id of the deleted resource",
  }),
  requestId: z.string().openapi({
    example: "123e4567-e89b-12d3-a456-426655440000",
  }),
});
