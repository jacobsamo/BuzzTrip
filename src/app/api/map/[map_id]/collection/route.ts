import { createCollection } from "@/lib/crud/collections";
import { withAuth } from "@/lib/utils";
import { collectionSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const POST = withAuth(async ({ req, params }) => {
  try {
    const json = await req.json();
    const collection = collectionSchema.parse(json);

    const createdCollection = await createCollection(collection);

    return NextResponse.json({
      message: "Created collection successfully",
      data: createdCollection,
    });
  } catch (error) {
    console.error("Error on /api/[map_id]/collection", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
