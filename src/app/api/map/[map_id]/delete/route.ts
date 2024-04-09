import { deleteMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { map_id: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

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
}
