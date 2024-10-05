import * as schema from "./schema";
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

const client =  createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export const db = drizzle(client, {
  schema: schema,
  logger: process.env.NODE_ENV === "development",
});
