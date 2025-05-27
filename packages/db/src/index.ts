import { createClient, type Config } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";

export const createDb = (
  url: string,
  authToken: string,
  production: boolean
) => {
  const connection: Config = production
    ? {
        url: url,
        authToken: authToken,
      }
    : {
        url: "http://127.0.0.1:8080",
      };
  console.log("creating db connection with connection:", connection.url);
  const turso = createClient(connection);

  const drizzleConnection = drizzle(turso, {
    schema: schema,
    logger: production,
  });
  return drizzleConnection;
};

export type Database = ReturnType<typeof createDb>;
