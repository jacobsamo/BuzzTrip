import { TablesInsert } from "@/../database.types";
import { createClient } from "../supabase/server";

export async function createLocation(location: TablesInsert<"locations">) {
  const supabase = createClient();

  const { data: createdLocation, error: createLocationError } = await supabase
    .from("locations")
    .insert(location)
    .select();

  if (!createdLocation || createLocationError) {
    throw Error("Error creating new Location.", {
      cause: createLocationError,
    });
  }

  return createdLocation[0];
}
