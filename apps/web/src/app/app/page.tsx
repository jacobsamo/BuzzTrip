import UserMaps from "@/components/layouts/user-maps";
import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { db } from "@/server/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { maps, map_users } from "@buzztrip/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function MapPage() {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const usersMaps = await getUserMaps(db, userId);

  return <UserMaps userId={userId} usersMaps={usersMaps} />;
}
