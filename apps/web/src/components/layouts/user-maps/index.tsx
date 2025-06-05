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
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { useQuery } from "convex/react";
import { MapIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import MapCard from "./map-card";

interface UserMapsProps {
  userId: string;
}

const UserMaps = ({ userId }: UserMapsProps) => {
  const maps = useQuery(api.maps.index.getUserMaps, {
    userId: userId as Id<"users">,
  });
  const [sortOption, setSortOption] = useState("updatedAt");
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
            case "_creationTime":
              return (
                new Date(b._creationTime).getTime() -
                new Date(a._creationTime).getTime()
              );
            case "updatedAt":
            default:
              if (!a.updatedAt || !b.updatedAt) return 0;
              return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
              );
          }
        })
      : null;
  }, [filteredMaps, sortOption]);

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
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex w-full items-center justify-end">
        <MapModal />
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 justify-end items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="._creationTime">Date Created</SelectItem>
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
            {sortedMaps &&
              sortedMaps.map((map) => (
                <motion.div
                  key={map.map_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapCard map={map} />
                </motion.div>
              ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserMaps;
