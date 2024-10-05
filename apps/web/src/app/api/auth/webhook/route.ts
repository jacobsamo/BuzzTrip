import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@buzztrip/db";
import { users } from "@buzztrip/db/schema";
import { NewUser } from "@buzztrip/db/types";
import { eq } from "drizzle-orm";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

export async function POST(request: Request) {
  try {
    const payload = await validateRequest(request);

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

    return Response.json({ message: "Received" });
  } catch (error) {
    console.error("Error on /api/auth/webhook", error);

    return new Response("Error on /api/auth/webhook", { status: 500 });
  }
}
