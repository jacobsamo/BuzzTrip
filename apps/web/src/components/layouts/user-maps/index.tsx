"use client";
import MapCard from "@/components/map-card";
import MapModal from "@/components/modals/create_map_modal";
import { UserMap } from "@buzztrip/db/types";
import { useState } from "react";

interface UserMapsProps {
  userId: string;
  usersMaps: UserMap[] | null;
}

const UserMaps = ({ usersMaps }: UserMapsProps) => {
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
                created_at: map.created_at,
                updated_at: map.updated_at,
              };
              setMaps((prev) => (prev ? [...prev, newMap] : [newMap]));
            }
            return;
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {maps &&
          maps
            .filter((map, index, self) => {
              const seenIds = new Set(
                self.slice(0, index).map((m) => m.map_id)
              );
              return !seenIds.has(map.map_id);
            })
            .sort((a, b) => {
              if (a.created_at && b.created_at) {
                return (
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
                );
              }
              if (a.created_at && !b.created_at) {
                return -1;
              }
              if (b.created_at && !a.created_at) {
                return 1;
              }
              return 0;
            })
            .map((map, index) => (
              <MapCard
                key={map.map_id + index}
                map={{
                  map_id: map.map_id!,
                  title: map.title!,
                  description: map.description,
                  image: map.image,
                  owner_id: map.owner_id!,
                  created_at: map.created_at,
                  updated_at: map.updated_at,
                }}
                updateMap={(m) => {
                  const newMap: UserMap = {
                    title: m.title ?? map.title,
                    description: m.description ?? map.description,
                    map_id: map.map_id,
                    owner_id: map.owner_id,
                    image: m.image ?? map.image,
                    user_id: map.owner_id,
                    permission: "owner",
                    map_user_id: map.owner_id,
                    created_at: map.created_at,
                    updated_at: map.updated_at,
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
