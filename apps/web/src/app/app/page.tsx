import UserMaps from "@/components/layouts/user-maps";
import { UserButton } from "@/components/user-button";
import { db } from "@/server/db";
import { getSession } from "@/server/getSession";
import { getUserMaps } from "@buzztrip/db/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const { data } = await getSession();

  if (!data || !data.session) {
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
      <UserMaps userId={data.session.userId}/>
    </div>
  );
}
