import getSupabaseServerClient from "@/server/supabaseServer";
import { TablesInsert } from "database.types";
import { getUser } from "../getUser";
import { Map } from "../types";
import { AppLoadContext } from "@remix-run/cloudflare";

type CreateMapType = Pick<Map, "title" | "description">;

export async function createMap(
  map: CreateMapType,
  request: Request,
  context: AppLoadContext
) {
  const supabase = getSupabaseServerClient(request, context);
  const user = await getUser(request, context);

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newMap: TablesInsert<"map"> = {
    title: map.title,
    description: map.description,
    created_by: user.id,
  };

  const { data: createdMap, error: createMapError } = await supabase
    .from("map")
    .insert(newMap)
    .select();

  if (!createdMap || createMapError) {
    return new Error("Error creating new map.", {
      cause: createMapError,
    });
  }

  const shared_map: TablesInsert<"shared_map"> = {
    map_id: createdMap[0].uid,
    user_id: user.id,
    permission: "owner",
  };

  const { data: createSharedMap, error: createSharedMapError } = await supabase
    .from("shared_map")
    .insert(shared_map)
    .select();

  if (!createSharedMap || createSharedMapError) {
    return new Error("Error creating new shared map.", {
      cause: createSharedMapError,
    });
  }

  return { map: createdMap[0], shared_map: createSharedMap[0] };
}

export async function deleteMap(
  map_id: string,
  request: Request,
  context: AppLoadContext
) {
  const supabase = getSupabaseServerClient(request, context);
  const user = await getUser(request, context);

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const { data: map } = await supabase
    .from("shared_map_view")
    .select()
    .eq("user_id", map_id)
    .single();

  if (map?.permission === "admin" || map?.permission === "owner") {
    // should cacade delete all items with a matching map_id
    await supabase.from("map").delete().eq("uid", map_id);

    return { message: "deleted map successfully" };
  }
  return new Error("you don't have the right permissions");
}
