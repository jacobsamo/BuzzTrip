import getSupabaseServerClient from "@/server/supabaseServer";
import { TablesInsert } from "database.types";
import { getUser } from "../getUser";
import { Collection } from "../types";


export async function createCollection(collection: Collection, request: Request) {
    const supabase = getSupabaseServerClient(request);
    const user = await getUser(request);

    if (!user) {
        return new Error("UNAUTHORIZED: user not found.")
    }

    const newCollection: TablesInsert<"collection"> = {
        ...collection,
    }

    const {data: createdCollection, error: createCollectionError} = await supabase.from('collection').insert(newCollection).select();

    if (!createdCollection || createCollectionError) {
        return new Error("Error creating new collection.", {
            cause: createCollectionError
        })
    }

    

    return {collection: createdCollection[0]};
}