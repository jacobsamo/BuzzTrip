"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/convex/_generated/api";
import { Id } from "@buzztrip/backend/convex/_generated/dataModel";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
} from "@buzztrip/components/ui";
import { Calendar, Map, MapPin, Users } from "lucide-react";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const userId = params.id as Id<"users">;

  // Get user data
  const users = useQuery(api.admin.users.getAllUsersWithStats);
  const user = users?.find((u) => u._id === userId);
  const stats = useQuery(api.admin.users.getUserDetailStats, { userId });

  if (users && !user) {
    notFound();
  }

  if (!user || !stats) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-muted-foreground">Loading user details...</div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const joinedDate = new Date(user._creationTime).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Details</h1>
        <p className="text-muted-foreground mt-2">
          View detailed information about this user
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              {user.username && (
                <Badge variant="outline" className="text-base">
                  @{user.username}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joined</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{joinedDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maps</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markers</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMarkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collaborations}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Total Collections</span>
              <span className="font-semibold">{stats.totalCollections}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-muted-foreground">Owned Maps</span>
              <span className="font-semibold">{stats.totalMaps}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Maps as Collaborator</span>
              <span className="font-semibold">{stats.collaborations}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
