import { createMap } from "@/lib/crud/maps";
import { createMarker } from "@/lib/crud/markers";
import { getUser } from "@/lib/getUser";
import { createClient } from "@/lib/supabase/server";
import { markerSchema } from "@/types/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { TablesInsert } from "../../../../database.types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const map = z
      .object({
        title: z.string(),
        description: z.string().nullable(),
      })
      .parse(json);

    const newMap: TablesInsert<"map"> = {
      title: map.title,
      description: map.description,
      created_by: user.id,
    };

    const createdMap = await createMap(newMap);

    return NextResponse.json({
      message: "Created map successfully",
      data: createdMap,
    });
  } catch (error) {
    console.error("Error on /api/map", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
}
