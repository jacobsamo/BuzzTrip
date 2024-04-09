import { deleteMarker } from "@/lib/crud/markers";
import { withAuth } from "@/lib/utils";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const DELETE = withAuth(async ({ req, params }) => {
  try {
    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const deletedMarker = await deleteMarker(params.uid);

    return NextResponse.json({
      message: "Updated marker successfully",
      data: deletedMarker,
    });
  } catch (error) {
    console.error(`Error on /api/[map_id]/marker/${params.uid}/delete`, error);

    return NextResponse.json(
      { error: `Error on /api/[map_id]/marker/${params.uid}/delete: ${error}` },
      { status: 500 }
    );
  }
});
