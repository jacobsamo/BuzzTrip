import UserMaps from "@/components/layouts/user-maps";
import { db } from "@/server/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function MapPage() {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const usersMaps = await getUserMaps(db, userId);

  return <UserMaps userId={userId} usersMaps={usersMaps} />;
}
