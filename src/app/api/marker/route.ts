import { createMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createClient } from "@/lib/supabase/server";
import { markerSchema } from "@/types/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const marker = markerSchema
      .extend({
        uid: z.string().optional(),
      })
      .parse({ ...json!, created_by: user.id });

    const createdMarker = await createMarker(marker);

    return NextResponse.json({
      message: "Created marker successfully",
      data: createdMarker,
    });
  } catch (error) {
    console.error("Error on /api/marker", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
