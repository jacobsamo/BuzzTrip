import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";

export const createDb = (url: string, authToken: string) => {
  return drizzle({
    connection:
      process.env.NODE_ENV === "production"
        ? {
            url: url,
            authToken: authToken,
          }
        : {
            url: "http://127.0.0.1:8080",
          },
    schema: schema,
    logger: process.env.NODE_ENV === "development",
  });
};

export type Database = ReturnType<typeof createDb>;
