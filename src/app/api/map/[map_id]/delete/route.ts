import { deleteMarker } from "@/lib/crud/markers";
import { withAuth } from "@/lib/utils/checks";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const DELETE = withAuth(async ({ req, params }) => {
  try {
    if (!params.map_id) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const editedMarker = await deleteMarker(params.map_id);

    return NextResponse.json({
      message: "Updated marker successfully",
      data: editedMarker,
    });
  } catch (error) {
    console.error(`Error on /api/map/${params.map_id}/delete`, error);

    return NextResponse.json(
      { error: `Error on /api/map/${params.map_id}/delete: ${error}` },
      { status: 500 }
    );
  }
});
