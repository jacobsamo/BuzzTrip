import { Bindings } from "@/common/bindings";
import { ErrorSchema } from "@/common/schema";
import { createDb } from "@buzztrip/db";
import { getMarkersView } from "@buzztrip/db/queries";
import { collection_links, locations, markers } from "@buzztrip/db/schema";
import { NewCollectionLink, NewLocation } from "@buzztrip/db/types";
import { getAuth } from "@hono/clerk-auth";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { MapParamsSchema } from "../schema";
import {
  CreateMarkerSchema,
  CreateMarkersReturnSchema,
  EditMarkerReturnSchema,
  EditMarkerSchema,
  MarkerParamsSchema,
} from "./schema";
import { createMarkerHandler, editMarkerHandler } from "./marker.handlers";
import { createMarker, editMarker } from "./marker.routes";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const routes = app
  .openapi(createMarker, createMarkerHandler)
  .openapi(editMarker, editMarkerHandler);

export default routes;
