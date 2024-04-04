import { TablesInsert, TablesUpdate } from "@/../database.types";
import { getUser } from "../getUser";
import { supabaseServer } from "../supabase";


export async function createCollection(
  collection: TablesInsert<"collection">,
) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newCollection: TablesInsert<"collection"> = {
    ...collection,
  };

  const { data: createdCollection, error: createCollectionError } =
    await supabaseServer.from("collection").insert(newCollection).select();

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
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const { data: editedCollection, error: editCollectionError } = await supabaseServer
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
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const { data: deleteMarkers, error: deleteMarkersError } = await supabaseServer
  .from("marker")
  .delete().eq("collection_id", uid)
  .select();

  if (!deleteMarkers || deleteMarkersError) {
    return new Error(`Error deleting collection ${uid}`, {
      cause: deleteMarkersError,
    });
  }


  const { data: deleteCollection, error: deletedCollectionError } = await supabaseServer
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

