import { TablesInsert } from "@/../database.types";
import { Map } from "@/types";
import { getUser } from "../getUser";
import { createClient } from "../supabase/server";

export async function createMap(
  map: TablesInsert<"map">,
) {
  const supabase = createClient();


  const { data: createdMap, error: createMapError } = await supabase
    .from("map")
    .insert(map)
    .select();

  if (!createdMap || createMapError) {
    return new Error("Error creating new map.", {
      cause: createMapError,
    });
  }

  const shared_map: TablesInsert<"shared_map"> = {
    map_id: createdMap[0].uid,
    user_id: map.created_by,
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
) {
  const supabase = createClient();

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


export async function shareMap(
  sharedMap: TablesInsert<"shared_map">,
) {
  const supabase = createClient();

  const { data: createdSharedMap, error: createSharedMapError } = await supabase
    .from("shared_map")
    .insert(sharedMap)
    .select();

  if (!createdSharedMap || createSharedMapError) {
    return new Error("Error creating new map.", {
      cause: createSharedMapError,
    });
  }


  return { sharedMap: createdSharedMap[0] };
}
