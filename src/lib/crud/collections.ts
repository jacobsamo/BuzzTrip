import { TablesInsert, TablesUpdate } from "@/../database.types";
import { getUser } from "../getUser";
import { createClient } from "../supabase/server";


export async function createCollection(
  collection: TablesInsert<"collection">,
) {
  const supabase = await createClient();

  const { data: createdCollection, error: createCollectionError } =
    await supabase.from("collection").insert(collection).select();

  if (!createdCollection || createCollectionError) {
    return new Error("Error creating new collection.", {
      cause: createCollectionError,
    });
  }

  return { collection: createdCollection[0] };
}


export async function editCollection(
  uid: string,
  collection: TablesUpdate<"collection">,
) {
  const supabase = await createClient();

  const { data: editedCollection, error: editCollectionError } = await supabase
    .from("collection")
    .update(collection).eq("uid", uid)
    .select();

  if (!editedCollection || editCollectionError) {
    return new Error(`Error editing marker ${uid}`, {
      cause: editCollectionError,
    });
  }

  return { collection: editedCollection[0] };
}


export async function deleteCollection(
  uid: string,
) {
  const supabase = await createClient();

  const { data: deleteMarkers, error: deleteMarkersError } = await supabase
  .from("marker")
  .delete().eq("collection_id", uid)
  .select();

  if (!deleteMarkers || deleteMarkersError) {
    return new Error(`Error deleting collection ${uid}`, {
      cause: deleteMarkersError,
    });
  }

  const { data: deleteCollection, error: deletedCollectionError } = await supabase
    .from("collection")
    .delete().eq("uid", uid)
    .select();

  if (!deleteCollection || deletedCollectionError) {
    return new Error(`Error deleting collection ${uid}`, {
      cause: deletedCollectionError,
    });
  }

  return { collection: deleteCollection[0] };
}

