import { createCollection } from "@/lib/crud/collections";
import { createMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createClient } from "@/lib/supabase/server";
import { collectionSchema, markerSchema } from "@/types/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: NextRequest, { params }: { params: { map_id: string }}) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const collection = collectionSchema.parse(json);

    const createdCollection = await createCollection(collection);

    return NextResponse.json({
      message: "Created collection successfully",
      data: createdCollection,
    });
  } catch (error) {
    console.error("Error on /api/collection", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
