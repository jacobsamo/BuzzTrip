import { shareMap } from "@/lib/crud/maps";
import { withAuth } from "@/lib/utils";
import { sharedMapSchema } from "@/types/schemas";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export const POST = withAuth(async ({req, params}) => {
  try {
    if (!params.map_id) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const json = await req.json();
    const shared_map = sharedMapSchema.parse(json);

    const createdMap = await shareMap(shared_map);

    revalidatePath("/home");

    return NextResponse.json({
      message: "shared map successfully",
      data: createdMap,
    });
  } catch (error) {
    console.error(`Error on /api/map/${params.map_id}/share`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});