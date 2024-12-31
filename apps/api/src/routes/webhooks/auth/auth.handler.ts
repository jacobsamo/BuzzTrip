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
    const payload = await c.req.text();

    const svix_id = c.req.header("svix-id");
    const svix_timestamp = c.req.header("svix-timestamp");
    const svix_signature = c.req.header("svix-signature");

    if (
      svix_id == undefined ||
      svix_timestamp == undefined ||
      svix_signature == undefined
    ) {
      console.error("No svix headers found");
      return c.json(
        {
          code: "failed_webhook",
          message:
            "Failed to process webhook request because headers are missing",
          requestId: c.get("requestId"),
        },
        400
      );
    }

    const wh = new Webhook(c.env.CLERK_WEBHOOK_SECRET);

    let event: WebhookEvent | null = null;

    try {
      event = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error verifying webhook:", err);
        throw Error("Failed to verify webhook", err);
      }
    }

    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    if (!event) {
      throw Error("No event found");
    }

    switch (event.type) {
      case "user.created":
        const email = event.data.primary_email_address_id
          ? event.data.email_addresses.find(
              (eml) => eml.id === event.data.primary_email_address_id
            )
          : event.data.email_addresses[0];

        const user: NewUser = {
          user_id: event.data.id,
          first_name: event.data.first_name,
          last_name: event.data.last_name,
          username: event.data.username,
          email: email?.email_address!,
        };

        await db.insert(users).values(user);

        break;
      case "user.deleted":
        if (!event.data.id) break;

        await db.delete(users).where(eq(users.user_id, event.data.id));

        break;
      case "user.updated":
        const updatedUser: Omit<NewUser, "user_id" | "email"> = {
          first_name: event.data.first_name,
          last_name: event.data.last_name,
          username: event.data.username,
        };

        await db.update(users).set(updatedUser);

        break;
    }

    return c.json({ message: "Received" }, 200);
  } catch (error) {
    console.error("Failed to process", {
      payload: await c.req.text(),
      error: c.error,
    });
    return c.json(
      {
        code: "failed_webhook",
        message: "Failed to process clerk webhook request",
        requestId: c.get("requestId"),
        error: error,
      },
      400
    );
  }
};
