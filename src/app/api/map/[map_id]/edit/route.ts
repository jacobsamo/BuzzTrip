import { withAuth } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const PUT = withAuth(async ({ req, params }) => {
  try {
    //   const user = await getUser()

    // if (!user) {
    //   return NextResponse.json("Unauthorized", { status: 401 });
    // }

    // if (!params.uid) {
    //   return NextResponse.json("Missing uid", { status: 400 });
    // }

    // const json = await req.json();
    // const marker = mapEdit.parse(json);

    // const editedMarker = await editMarker(params.uid, marker)

    return NextResponse.json({ message: "Coming soon..." }, { status: 501 });
  } catch (error) {
    console.error(`Error on /api/map/${params.map_id}/edit`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
