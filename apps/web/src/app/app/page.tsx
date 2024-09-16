import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { db } from "@/server/db";
import { maps, map_users } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function MapPage() {
  const { userId } = auth();

  if (!userId) {
    return notFound();
  }

  const usersMaps = await db
    .select({
      map_id: maps.map_id,
      title: maps.title,
      description: maps.description,
      image: maps.image,
      owner_id: maps.owner_id,
      user_id: map_users.user_id,
      permission: map_users.user_id,
    })
    .from(map_users)
    .leftJoin(maps, eq(map_users.map_id, maps.map_id))
    .where(eq(maps.owner_id, userId!));

  return (
    <main className="container mx-auto p-4">
      <div className="inline-flex w-full items-center justify-between">
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
          <MapCard
            key={map.map_id}
            map={{
              map_id: map.map_id!,
              title: map.title!,
              description: map.description,
              image: map.image,
              owner_id: map.owner_id!,
            }}
          />
        ))}
      </div>
    </main>
  );
}
