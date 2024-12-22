import UserMaps from "@/components/layouts/user-maps";
import { db } from "@/server/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { UserButton, UserProfile } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function MapPage() {
  const { userId } = await auth();

  if (!userId) {
    return notFound();
  }

  const usersMaps = await getUserMaps(db, userId);

  return (
    <>
      <nav className="flex items-center justify-between mb-2">
        <Link className="flex items-center justify-center" href="#">
          <Image
            width={44}
            height={44}
            src="/logos/logo_x48.png"
            alt="Logo"
            className="h-11 w-11 rounded-full"
          />
          <h1 className="ml-2 text-2xl font-bold">BuzzTrip</h1>
        </Link>
        <UserButton />
      </nav>
      <UserMaps userId={userId} usersMaps={usersMaps} />
    </>
  );
}
