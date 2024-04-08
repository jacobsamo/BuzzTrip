import { TablesInsert, TablesUpdate } from "@/../database.types";
import { getUser } from "../getUser";
import { createClient } from "../supabase/server";

export async function createMarker(marker: TablesInsert<"marker">) {
  const supabase = createClient();

  const { data: createdMarker, error: createMarkerError } = await supabase
    .from("marker")
    .insert(marker)
    .select();

  if (!createdMarker || createMarkerError) {
    return new Error("Error creating new marker.", {
      cause: createMarkerError,
    });
  }

  return createdMarker[0];
}

export async function editMarker(uid: string, marker: TablesUpdate<"marker">) {
  const supabase = createClient();

  const { data: editedMarker, error: editedMarkerError } = await supabase
    .from("marker")
    .update(marker)
    .eq("uid", uid)
    .select();

  if (!editedMarker || editedMarkerError) {
    return new Error(`Error editing marker ${uid}`, {
      cause: editedMarkerError,
    });
  }

  return editedMarker[0];
}

export async function deleteMarker(uid: string) {
  const supabase = createClient();

  const { data: deletedMarker, error: deletedMarkerError } = await supabase
    .from("marker")
    .delete()
    .eq("uid", uid)
    .select();

  if (!deletedMarker || deletedMarkerError) {
    return new Error(`Error deleting marker ${uid}`, {
      cause: deletedMarkerError,
    });
  }

  return deletedMarker[0];
}
