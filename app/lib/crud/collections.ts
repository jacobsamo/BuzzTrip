import getSupabaseServerClient from "@/server/supabaseServer";
import { TablesInsert } from "database.types";
import { getUser } from "../getUser";
import { AppLoadContext } from "@remix-run/cloudflare";


export async function createCollection(collection: TablesInsert<"collection">, request: Request, context: AppLoadContext) {
    const supabase = getSupabaseServerClient(request, context);
    const user = await getUser(request, context);

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