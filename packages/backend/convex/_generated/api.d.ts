/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as betterAuth from "../betterAuth.js";
import type * as helpers from "../helpers.js";
import type * as maps_collections from "../maps/collections.js";
import type * as maps_index from "../maps/index.js";
import type * as schemas_auth from "../schemas/auth.js";
import type * as schemas_maps from "../schemas/maps.js";
import type * as schemas_places from "../schemas/places.js";
import type * as schemas_shared from "../schemas/shared.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  betterAuth: typeof betterAuth;
  helpers: typeof helpers;
  "maps/collections": typeof maps_collections;
  "maps/index": typeof maps_index;
  "schemas/auth": typeof schemas_auth;
  "schemas/maps": typeof schemas_maps;
  "schemas/places": typeof schemas_places;
  "schemas/shared": typeof schemas_shared;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
