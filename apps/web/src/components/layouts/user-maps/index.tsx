"use client";
import React, { useState } from "react";
import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { db } from "@/server/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { maps, map_users } from "@buzztrip/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UserMap } from "@buzztrip/db/types";

interface UserMapsProps {
  userId: string;
  usersMaps: UserMap[] | null;
}

const UserMaps = ({ userId, usersMaps }: UserMapsProps) => {
  const [maps, setMaps] = useState<UserMap[] | null>(usersMaps);

  return (
    <>
      <div className="inline-flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Maps</h1>
          <p className="text-sm text-gray-500">
            Create, edit, and share your custom maps with ease.
          </p>
        </div>
        <MapModal setMap={(map) => setMaps((prev) => [...prev, map])} />
      </div>

      <div className="flex flex-wrap gap-2">
        {maps.map((map) => (
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
    </>
  );
};

export default UserMaps;
