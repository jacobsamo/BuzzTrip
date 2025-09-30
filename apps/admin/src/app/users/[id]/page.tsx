"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/components";
import { Badge, Button } from "@buzztrip/components/ui";
import { useConvexUserById } from "@/hooks/use-admin-data";
import { ArrowLeft, Calendar, Users, Map, Eye } from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const user = useConvexUserById(userId);

  if (user === undefined) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
        <div className="space-y-4">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || user.name || "Unknown User";
  const filteredSharedMaps = user.sharedMaps.filter(sharedMap => !user.ownedMaps.some(ownedMap => ownedMap.id === sharedMap.id));

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <Image
              src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt={fullName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border border-border"
            />
            <div>
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maps Created</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.mapsCreated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.collaborations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activity</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalActivity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Owned Maps */}
      <Card>
        <CardHeader>
          <CardTitle>Owned Maps ({user.ownedMaps.length})</CardTitle>
          <CardDescription>Maps created and owned by this user</CardDescription>
        </CardHeader>
        <CardContent>
          {user.ownedMaps.length > 0 ? (
            <div className="h-[300px] overflow-y-auto border rounded-md p-4">
              <div className="space-y-3">
                {user.ownedMaps.map((map) => (
                  <div key={map.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{map.title}</h3>
                      {map.description && (
                        <p className="text-sm text-muted-foreground mt-1">{map.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={map.visibility === 'public' ? 'default' : 'secondary'}>
                          {map.visibility}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(map.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/maps/${map.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No owned maps</p>
          )}
        </CardContent>
      </Card>

      {/* Shared Maps */}
      <Card>
        <CardHeader>
          <CardTitle>Shared Maps ({filteredSharedMaps.length})</CardTitle>
          <CardDescription>Maps shared with this user</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSharedMaps.length > 0 ? (
            <div className="h-[300px] overflow-y-auto border rounded-md p-4">
              <div className="space-y-3">
                {filteredSharedMaps.map((map) => (
                  <div key={map.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{map.title}</h3>
                      {map.description && (
                        <p className="text-sm text-muted-foreground mt-1">{map.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{map.permission}</Badge>
                        <Badge variant={map.visibility === 'public' ? 'default' : 'secondary'}>
                          {map.visibility}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Owner: {map.owner.name}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/maps/${map.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No shared maps</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}