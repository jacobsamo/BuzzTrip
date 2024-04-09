import { deleteCollection } from "@/lib/crud/collections";
import { withAuth } from "@/lib/utils";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const DELETE = withAuth(async ({ req, params }) => {
  try {
    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const deletedCollection = await deleteCollection(params.uid);

    return NextResponse.json({
      message: "Deleted collection and it's data successfully",
      data: deletedCollection,
    });
  } catch (error) {
    console.error(
      `Error on /api/[map_id]/collection/${params.uid}/delete`,
      error
    );

    return NextResponse.json(
      {
        error: `Error on /api/[map_id]/collection/${params.uid}/delete: ${error}`,
      },
      { status: 500 }
    );
  }
});
