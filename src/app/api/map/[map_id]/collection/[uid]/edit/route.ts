import { editCollection } from "@/lib/crud/collections";
import { withAuth } from "@/lib/utils/checks";
import { collectionSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const PUT = withAuth(async ({ req, params }) => {
  try {
    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const json = await req.json();
    const collection = collectionSchema.partial().parse(json);

    const editedCollection = await editCollection(params.uid, collection);

    return NextResponse.json({
      message: "Updated collection successfully",
      data: editedCollection,
    });
  } catch (error) {
    console.error(
      `Error on /api/[map_id]/collection/${params.uid}/edit`,
      error
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
