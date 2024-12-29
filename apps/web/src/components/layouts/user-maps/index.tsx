"use client";
import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_edit_map_modal";
import { UserMap } from "@buzztrip/db/types";
import { useState } from "react";

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
        <MapModal
          setMap={(map) => {
            if (map) {
              const newMap: UserMap = {
                title: map.title,
                description: map.description,
                map_id: map.map_id,
                owner_id: map.owner_id,
                image: map.image,
                user_id: map.owner_id,
                permission: "owner",
                map_user_id: map.owner_id,
              };
              setMaps((prev) => (prev ? [...prev, newMap] : [newMap]));
            }
            return;
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {maps &&
          maps.map((map) => (
            <MapCard
              key={map.map_id}
              map={{
                map_id: map.map_id!,
                title: map.title!,
                description: map.description,
                image: map.image,
                owner_id: map.owner_id!,
              }}
              updateMap={(m) => {
                console.log("passed", m)
                const newMap: UserMap = {
                  title: m.title ?? map.title,
                  description: m.description ?? map.description,
                  map_id: map.map_id,
                  owner_id: map.owner_id,
                  image: m.image ?? map.image,
                  user_id: map.owner_id,
                  permission: "owner",
                  map_user_id: map.owner_id,
                };
                // update the map with the same mapId
                setMaps(
                  (prev) =>
                    prev?.map((m) =>
                      m.map_id === map.map_id ? newMap : m
                    ) ?? [newMap]
                );
              }}
            />
          ))}
      </div>
    </>
  );
};

export default UserMaps;
