import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";

export const createDb = (url: string, authToken: string) => {
  console.log("creating db connection with connection:", url);
  const turso = createClient({
    url: url,
    authToken: authToken,
  });

  const drizzleConnection = drizzle(turso, {
    schema: schema,
  });
  return drizzleConnection;
};

export type Database = ReturnType<typeof createDb>;
