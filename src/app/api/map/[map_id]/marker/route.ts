import { createLocation } from "@/lib/crud/locations";
import { createMarker } from "@/lib/crud/markers";
import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/utils/checks";
import { markersSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withAuth(async ({ req, params, user }) => {
  try {
    const json = await req.json();
    const supabase = await createClient();
    const marker = markersSchema.parse({ ...json!, created_by: user.id });

    let location_id = null;

    const { data, error } = await supabase
      .from("locations")
      .select()
      .eq("lat", marker.lat)
      .eq("lng", marker.lng)
      .single();

    if (!data) {
      const newLocation = await createLocation(json.location);
      location_id = newLocation.uid;
    }

    const newMarker = await createMarker({
      created_by: user.id,
      map_id: params.map_id,
      collection_id: marker.collection_id,
      location_id: location_id,
      title: marker.title,
      color: marker.color,
      icon: marker.icon,
      note: marker.note,
    });

    const { data: createdMarker } = await supabase
      .from("markers_view")
      .select()
      .eq("map_id", marker.map_id);

    return NextResponse.json({
      message: "Created marker successfully",
      data: createdMarker,
    });
  } catch (error) {
    console.error("Error on /api/[map_id]/marker", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
