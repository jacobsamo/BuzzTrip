import * as schema from "./schemas";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// const client =
//   process.env.NODE_ENV === "production"
//     ? createClient({
//         url: process.env.TURSO_CONNECTION_URL!,
//         authToken: process.env.TURSO_AUTH_TOKEN!,
//       })
//     : createClient({
//         url: "file:./buzztrip-local.db",
//       });

export const createDb = (url: string, authToken: string) => {
  return drizzle(
    createClient(
      process.env.NODE_ENV === "production"
        ? {
            url: url,
            authToken: authToken,
          }
        : {
            url: "http://127.0.0.1:8080",
          }
    ),
    {
      schema: schema,
      logger: process.env.NODE_ENV === "development",
    }
  );
};

export type Database = ReturnType<typeof createDb>;
