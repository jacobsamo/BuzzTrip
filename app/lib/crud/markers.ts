import getSupabaseServerClient from "@/server/supabaseServer";
import { TablesInsert } from "database.types";
import { getUser } from "../getUser";
import { AppLoadContext } from "@remix-run/cloudflare";

export async function createMarker(
  marker: TablesInsert<"marker">,
  request: Request,
  context: AppLoadContext
) {
  const supabase = getSupabaseServerClient(request, context);
  const user = await getUser(request, context);

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newMarker: TablesInsert<"marker"> = {
    ...marker,
    created_by: user.id,
  };

  const { data: createdMarker, error: createMarkerError } = await supabase
    .from("marker")
    .insert(newMarker)
    .select();

  if (!createdMarker || createMarkerError) {
    return new Error("Error creating new marker.", {
      cause: createMarkerError,
    });
  }

  return { marker: createdMarker[0] };
}
