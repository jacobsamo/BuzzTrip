import { createDb } from "@buzztrip/db";
import { users } from "@buzztrip/db/schema";
import { NewUser } from "@buzztrip/db/types";
import { WebhookEvent } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import { AppRouteHandler } from "../../../common/types";
import { clerkWebhookRoute } from "./auth.routes";

export const clerkWebhookHandler: AppRouteHandler<
  typeof clerkWebhookRoute
> = async (c) => {
  try {
    const payloadString = await c.req.text();

    const svixHeaders = {
      "svix-id": c.header("svix-id")!,
      "svix-timestamp": c.header("svix-timestamp")!,
      "svix-signature": c.header("svix-signature")!,
    };
    const wh = new Webhook(c.env.CLERK_WEBHOOK_SECRET);
    const payload = wh.verify(payloadString, svixHeaders) as WebhookEvent;

    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    switch (payload.type) {
      case "user.created":
        const email = payload.data.primary_email_address_id
          ? payload.data.email_addresses.find(
              (eml) => eml.id === payload.data.primary_email_address_id
            )
          : payload.data.email_addresses[0];

        const user: NewUser = {
          user_id: payload.data.id,
          first_name: payload.data.first_name,
          last_name: payload.data.last_name,
          username: payload.data.username,
          email: email?.email_address!,
        };

        await db.insert(users).values(user);

        break;
      case "user.deleted":
        console.log("User deleted: ", payload.data.id);
        if (!payload.data.id) break;

        await db.delete(users).where(eq(users.user_id, payload.data.id));

        break;
      case "user.updated":
        const updatedUser: Omit<NewUser, "user_id" | "email"> = {
          first_name: payload.data.first_name,
          last_name: payload.data.last_name,
          username: payload.data.username,
        };

        await db.update(users).set(updatedUser);
        break;
    }

    return c.json({ message: "Received" }, 200);
  } catch (error) {
    console.error("Failed to process clerk webhook request", {
      payload: c.req.text(),
      error: c.error,
    });
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to process clerk webhook request",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};
