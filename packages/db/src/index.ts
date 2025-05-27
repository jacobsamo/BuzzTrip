import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas";

export const createDb = (url: string, authToken: string) => {
  console.log("creating db connection with connection:", url);

  const drizzleConnection = drizzle({
    connection: {
      url: url ?? "http://127.0.0.1:8080",
      authToken: authToken ?? "",
    },
    schema: schema,
  });
  return drizzleConnection;
};

export type Database = ReturnType<typeof createDb>;
