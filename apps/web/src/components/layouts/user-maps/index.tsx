"use client";
import MapModal from "@/components/modals/create_map_modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Map, UserMap } from "@buzztrip/db/types";
import { MapIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import MapCard from "./map-card";

interface UserMapsProps {
  userId: string;
  usersMaps: UserMap[] | null;
}

const UserMaps = ({ usersMaps }: UserMapsProps) => {
  const [maps, setMaps] = useState<UserMap[] | null>(usersMaps);
  const [sortOption, setSortOption] = useState("updated_at");
  const [searchValue, setSearchValue] = useState("");

  const filteredMaps = useMemo(() => {
    if (!maps) return null;
    if (!searchValue) return maps;
    return maps.filter((map) => {
      return (
        map.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        map.description?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });
  }, [maps, searchValue]);

  const sortedMaps = useMemo(() => {
    return filteredMaps
      ? [...filteredMaps].sort((a, b) => {
          switch (sortOption) {
            case "title":
              return a.title.localeCompare(b.title);
            case "created_at":
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            case "updated_at":
            default:
              return (
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
              );
          }
        })
      : null;
  }, [filteredMaps, sortOption]);

  const handleMapCreated = (map: Map | null) => {
    if (map) {
      const newMap: UserMap = {
        title: map.title,
        description: map.description,
        map_id: map.map_id,
        owner_id: map.owner_id,
        image: map.image,
        bounds: map.bounds,
        icon: map.icon,
        location_name: map.location_name,
        visibility: map.visibility,
        lat: map.lat,
        lng: map.lng,
        color: map.color,
        user_id: map.owner_id,
        permission: "owner",
        map_user_id: map.owner_id,
        created_at: map.created_at,
        updated_at: map.updated_at,
      };
      setMaps((prev) => (prev ? [...prev, newMap] : [newMap]));
    }
  };

  const handleMapUpdated = (map: Partial<Map>) => {
    console.log("handleMapUpdated", map);
    if (!maps) return;

    const foundMap = maps.find((m) => m.map_id === map.map_id);
    console.log("foundMap", foundMap);
    if (foundMap) {
      const newMap: UserMap = {
        ...foundMap,
        ...map,
      };
      console.log("newMap", newMap);
      setMaps((prev) => {
        if (!prev) return [newMap];

        return prev.map((m) =>
          m.map_id === map.map_id ? { ...m, ...map } : m
        );
      });
    }
  };

  if (!sortedMaps || sortedMaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-lg p-8">
        <MapIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No maps found</h3>
        <p className="text-muted-foreground text-center mb-6">
          You haven't created any maps yet. Create your first map to get
          started.
        </p>
        <MapModal
          trigger={
            <Button>
              <MapIcon className="mr-2 h-4 w-4" />
              Create Your First Map
            </Button>
          }
          setMap={handleMapCreated}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex w-full items-center justify-end">
        <MapModal setMap={handleMapCreated} />
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-end items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Last Updated</SelectItem>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by title or description"
            className="w-[240px]"
            type="search"
          />
        </div>

        <AnimatePresence mode="sync">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMaps.map((map) => (
              <motion.div
                key={map.map_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MapCard map={map} updateMap={handleMapUpdated} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserMaps;
