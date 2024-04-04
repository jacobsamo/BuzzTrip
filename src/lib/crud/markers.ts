import { TablesInsert, TablesUpdate } from "@/../database.types";
import { getUser } from "../getUser";
import { supabaseServer } from "../supabase";


export async function createMarker(
  marker: TablesInsert<"marker">,

) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newMarker: TablesInsert<"marker"> = {
    ...marker,
    created_by: user.id,
  };

  const { data: createdMarker, error: createMarkerError } = await supabaseServer
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

export async function editMarker(
  uid: string,
  marker: TablesUpdate<"marker">,
) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }

  const newMarker: TablesUpdate<"marker"> = {
    ...marker,
    created_by: user.id,
  };

  const { data: createdMarker, error: createMarkerError } = await supabaseServer
    .from("marker")
    .update(newMarker).eq("uid", uid)
    .select();

  if (!createdMarker || createMarkerError) {
    return new Error(`Error editing marker ${uid}`, {
      cause: createMarkerError,
    });
  }

  return { marker: createdMarker[0] };
}


export async function deleteMarker(
  uid: string,
) {
  const user = await getUser();

  if (!user) {
    return new Error("UNAUTHORIZED: user not found.");
  }


  const { data: createdMarker, error: createMarkerError } = await supabaseServer
    .from("marker")
    .delete().eq("uid", uid)
    .select();

  if (!createdMarker || createMarkerError) {
    return new Error(`Error deleting marker ${uid}`, {
      cause: createMarkerError,
    });
  }

  return { marker: createdMarker[0] };
}
