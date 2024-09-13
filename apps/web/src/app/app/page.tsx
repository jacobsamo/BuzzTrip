import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { db } from "@/server/db";
import { maps } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function MapPage() {
  const { userId } = auth();

  if (!userId) {
    return notFound();
  }

  const usersMaps = await db
    .select()
    .from(maps)
    .where(eq(maps.owner_id, userId!));

  console.log("Values ", usersMaps);

  return (
    <main className="container mx-auto p-4">
      <div className="inline-flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold">My Maps</h1>
          <p className="text-sm text-gray-500">
            Create, edit, and share your custom maps with ease.
          </p>
        </div>
        <MapModal />
      </div>

      <div className="flex flex-wrap gap-2">
        {usersMaps.map((map) => (
          <MapCard key={map.map_id} map={map} />
        ))}
      </div>
    </main>
  );
}
