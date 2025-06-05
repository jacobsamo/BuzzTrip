import { AdapterInstance } from "better-auth";
import { createAdapter, type AdapterDebugLogs } from "better-auth/adapters";
import type { ConvexHttpClient } from "convex/browser";

type ConvexAdapterOptions = {
    usePlural?: boolean;
    debugLogs?: boolean;
}

export type ConvexAdapter = (
	convexClient: ConvexHttpClient,
	config?: ConvexAdapterOptions,
) => AdapterInstance;

export const buzztripConvexAdapter: ConvexAdapter = (convexClient, config = {}) =>
  createAdapter({
    config: {
      adapterId: "better-auth-convex-adapter", // A unique identifier for the adapter.
      adapterName: "Convex Adapter", // The name of the adapter.
      usePlural: config.usePlural ?? false, // Whether the table names in the schema are plural.
      debugLogs: config.debugLogs ?? false, // Whether to enable debug logs.
      supportsJSON: true, // Whether the database supports JSON. (Default: false)
      supportsDates: true, // Whether the database supports dates. (Default: true)
      supportsBooleans: true, // Whether the database supports booleans. (Default: true)
      supportsNumericIds: false, // Whether the database supports auto-incrementing numeric IDs. (Default: true)
      disableIdGeneration: true,
    },
    adapter: ({ options, schema, debugLog, getModelName, getFieldName, getDefaultModelName, getDefaultFieldName, getFieldAttributes }) => {
      return {
        id: "convex",
        create: async ({ model, data, select }) => {
          // ...
        },
        update: async ({ model, update, where }) => {
          // ...
        },
        updateMany: async ({ model, update, where }) => {
          // ...
        },
        delete: async ({  model, where }) => {
          // ...
        },
    
        deleteMany({ model, where }) {},
        createSchema(props) {},
      };
    },
  });
