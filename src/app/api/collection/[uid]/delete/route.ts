import { deleteCollection } from "@/lib/crud/collections";
import { deleteMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const deletedCollection = await deleteCollection(params.uid);

    return NextResponse.json({
      message: "Deleted collection and it's data successfully",
      data: deletedCollection,
    });
  } catch (error) {
    console.error(`Error on /api/collection/${params.uid}/delete`, error);

    return NextResponse.json(
      { error: `Error on /api/collection/${params.uid}/delete: ${error}` },
      { status: 500 }
    );
  }
}
