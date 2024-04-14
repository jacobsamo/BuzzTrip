import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/utils/checks";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withAuth(async ({ req, params }) => {
  try {
    if (!params.uid) {
      return NextResponse.json("Missing uid", { status: 400 });
    }

    const supabase = await createClient();
    const { data: marker } = await supabase
      .from("marker")
      .select()
      .eq("uid", params.uid)
      .single();

    return NextResponse.json({ message: "Got marker", data: marker });
  } catch (error) {
    console.error(`Error on /api/[map_id]/marker/${params.uid}`, error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(null, { status: 500 });
  }
});
