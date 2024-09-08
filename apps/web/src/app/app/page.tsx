import { db } from "@/server/db";
import { maps } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
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

  return (
    <main className="p-2">
      <h1>My Maps</h1>
      <ul>
        {usersMaps.map((map) => (
          <li key={map.map_id}>{map.title}</li>
        ))}
      </ul>
    </main>
  );
}
