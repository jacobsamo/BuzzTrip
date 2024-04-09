import { createMarker } from "@/lib/crud/markers";
import { withAuth } from "@/lib/utils/checks";
import { markerSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const POST = withAuth(async ({ req, params, user }) => {
  try {
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
    console.error("Error on /api/[map_id]/marker", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
