import { editMarker } from "@/lib/crud/markers";
import { withAuth } from "@/lib/utils/checks";
import { markerEditSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const PUT = withAuth(async ({ req, params }) => {
  try {
    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const json = await req.json();
    const marker = markerEditSchema.partial().parse(json);

    const editedMarker = await editMarker(params.uid, marker);

    return NextResponse.json({
      message: "Updated marker successfully",
      data: editedMarker,
    });
  } catch (error) {
    console.error(`Error on /api/[map_id]/marker/${params.uid}/edit`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
