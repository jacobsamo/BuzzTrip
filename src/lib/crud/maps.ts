import { TablesInsert } from "@/../database.types";
import { Map } from "@/types";
import { getUser } from "../getUser";
import { supabaseServer } from "../supabase";

type CreateMapType = Pick<Map, "title" | "description">;

export async function createMap(
  map: CreateMapType,
) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newMap: TablesInsert<"map"> = {
    title: map.title,
    description: map.description,
    created_by: user.id,
  };

  const { data: createdMap, error: createMapError } = await supabaseServer
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

  const { data: createSharedMap, error: createSharedMapError } = await supabaseServer
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
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const { data: map } = await supabaseServer
    .from("shared_map_view")
    .select()
    .eq("user_id", map_id)
    .single();

  if (map?.permission === "admin" || map?.permission === "owner") {
    // should cacade delete all items with a matching map_id
    await supabaseServer.from("map").delete().eq("uid", map_id);

    return { message: "deleted map successfully" };
  }
  return new Error("you don't have the right permissions");
}


export async function shareMap(
  sharedMap: TablesInsert<"shared_map">,
) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }


  const { data: createdSharedMap, error: createSharedMapError } = await supabaseServer
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
