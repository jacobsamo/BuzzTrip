"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@buzztrip/components/ui";
import {
  MapPin,
  Users,
  FolderOpen,
  Route,
  Tag,
  Calendar,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function MapDetailPage({ params }: { params: { id: string } }) {
  const mapId = params.id as Id<"maps">;

  // Get map data
  const maps = useQuery(api.admin.maps.getAllMapsWithStats);
  const map = maps?.find((m) => m._id === mapId);
  const stats = useQuery(api.admin.maps.getMapDetailStats, { mapId });

  if (maps && !map) {
    notFound();
  }

  if (!map || !stats) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-muted-foreground">Loading map details...</div>
      </div>
    );
  }

  const createdDate = new Date(map._creationTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const updatedDate = map.updatedAt ? new Date(map.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : "N/A";

  const visibilityVariant =
    map.visibility === "public"
      ? "default"
      : map.visibility === "private"
      ? "destructive"
      : "secondary";

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Map Details</h1>
        <p className="text-muted-foreground mt-2">
          View detailed information about this map
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Map Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{map.title}</h2>
              {map.description && (
                <p className="text-muted-foreground mt-2">{map.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Owner:</span>
                  {map.owner ? (
                    <Link
                      href={`/users/${map.owner_id}`}
                      className="font-medium hover:underline"
                    >
                      {map.owner.name}
                    </Link>
                  ) : (
                    <span>Unknown</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Visibility:</span>
                  <Badge variant={visibilityVariant} className="capitalize">
                    {map.visibility}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{createdDate}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span className="font-medium">{updatedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Markers</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.markersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collectionsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paths</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pathsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labels</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.labelsCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.routesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collaboratorsCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
