import UserMaps from "@/components/layouts/user-maps";
import { convexNextjsOptions, getConvexServerSession } from "@/lib/auth";
import { api } from "@buzztrip/backend/api";
import { UserButton } from "@clerk/nextjs";
import { preloadQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MapPage() {
  const session = await getConvexServerSession();

  if (!session || session.message !== "Logged In" || !session.user._id) {
    return notFound();
  }

  const options = await convexNextjsOptions();

  const preloadedMaps = await preloadQuery(
    api.maps.index.getUserMaps,
    {
      userId: session.user._id,
    },
    options
  );

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
      <UserMaps preloadedMaps={preloadedMaps} />
    </div>
  );
}
