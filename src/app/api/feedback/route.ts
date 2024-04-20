import { createClient } from "@/lib/supabase/server";
import { withAuth } from "@/lib/utils/checks";
import { NextResponse } from "next/server";
import { z } from "zod";
import { TablesInsert } from "database.types";

export const POST = withAuth(async ({ req, params, user }) => {
  try {
    const json = await req.json();
    const supabase = await createClient();

    const newFeedback: TablesInsert<"feedback"> = {
      ...json,
      user_id: user.id,
      user_email: user.email,
    };

    const { data: feedback, error } = await supabase
      .from("feedback")
      .insert(newFeedback)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Created map successfully",
      data: feedback ? feedback[0] : null,
    });
  } catch (error) {
    console.error("Error on /api/map", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(JSON.stringify(error.issues), { status: 422 });
    }

    return NextResponse.json(error, {
      status: (error as { status?: number }).status || 500,
    });
  }
});
