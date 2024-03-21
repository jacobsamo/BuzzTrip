import getSupabaseServerClient from "@/server/supabaseServer";
import { redirect } from "@remix-run/cloudflare";
import { TablesInsert } from "database.types";
import { getUser } from "../getUser";
import { Map } from "../types";

type CreateMapType = Pick<Map, "title" | "description">;

export async function createMap(map: CreateMapType, request: Request) {
    const supabase = getSupabaseServerClient(request);
    const user = await getUser(request);

    if (!user) {
        return new Error("UNAUTHORIZED: user not found.")
    }

    const newMap: TablesInsert<"map"> = {
        title: map.title,
        description: map.description,
        created_by: user.id
    }

    const {data: createdMap, error: createMapError} = await supabase.from('map').insert(newMap).select();

    if (!createdMap || createMapError) {
        return new Error("Error creating new map.", {
            cause: createMapError
        })
    }

    const shared_map: TablesInsert<"shared_map"> = {
        map_id: createdMap[0].uid,
        user_id: user.id,
        permission: "owner"
    }

    const {data: createSharedMap, error: createSharedMapError} = await supabase.from('shared_map').insert(shared_map).select();

    if (!createSharedMap || createSharedMapError) {
        return new Error("Error creating new shared map.", {
            cause: createSharedMapError
        })
    }

    return {map: createdMap[0], shared_map: createSharedMap[0]};
}