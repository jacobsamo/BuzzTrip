import { createMap, shareMap } from "@/lib/crud/maps";
import { createMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createClient } from "@/lib/supabase/server";
import { markerSchema, sharedMapSchema } from "@/types/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TablesInsert } from "@/../database.types";
import { revalidatePath } from "next/cache";

export const runtime = "edge";

export async function POST(
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
}
