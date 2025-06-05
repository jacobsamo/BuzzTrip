import UserMaps from "@/components/layouts/user-maps";
import { UserButton } from "@clerk/nextjs";
import { api } from "@buzztrip/backend/api";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { env } from "env";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const user = await fetchQuery(api.users.userLoginStatus, {
    url: env.NEXT_PUBLIC_CONVEX_URL,
  });

  if (!user || user[0] !== "Logged In" || !user[1]) {
    return notFound();
  }


  return (
    <div className="p-2">
      <nav className="flex items-center justify-between mb-2">
        <Link className="flex items-center justify-center" href="#">
          <Image
            width={44}
            height={44}
            src="/logos/logo_x128.png"
            alt="Logo"
            className="h-11 w-11 rounded-full"
          />
          <h1 className="ml-2 text-2xl font-bold text-primary">BuzzTrip</h1>
        </Link>
        <UserButton />
      </nav>
      <UserMaps userId={user[1]._id} />
    </div>
  );
}
