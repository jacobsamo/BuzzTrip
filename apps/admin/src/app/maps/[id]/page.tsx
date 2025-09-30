"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/components";
import { Badge, Button, ScrollArea } from "@buzztrip/components/ui";
import { useConvexMapById } from "@/hooks/use-admin-data";
import { ArrowLeft, Map, Users, MapPin, Folder, Route, Eye } from "lucide-react";

export default function MapDetailPage() {
  const params = useParams();
  const mapId = params.id as string;
  const map = useConvexMapById(mapId);

  if (map === undefined) {
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

  if (map === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Map Not Found</h2>
          <p className="text-muted-foreground mb-4">The map you&apos;re looking for doesn&apos;t exist.</p>
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
            <Map className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">{map.title}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={map.visibility === 'public' ? 'default' : 'secondary'}>
                  {map.visibility}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(map.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {map.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{map.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Markers</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{map.stats.totalMarkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{map.stats.totalCollections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paths</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{map.stats.totalPaths}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{map.stats.totalCollaborators}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elements</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{map.stats.totalElements}</div>
          </CardContent>
        </Card>
      </div>

      {/* Owner & Collaborators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owner */}
        <Card>
          <CardHeader>
            <CardTitle>Map Owner</CardTitle>
          </CardHeader>
          <CardContent>
            {map.owner ? (
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Image
                  src={map.owner.imageUrl}
                  alt={map.owner.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full border border-border"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{map.owner.name}</h3>
                  <p className="text-sm text-muted-foreground">{map.owner.email}</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/users/${map.owner.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Owner information not available</p>
            )}
          </CardContent>
        </Card>

        {/* Collaborators */}
        <Card>
          <CardHeader>
            <CardTitle>Collaborators ({map.collaborators.length})</CardTitle>
            <CardDescription>Users with access to this map</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {map.collaborators.length > 0 ? (
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-3">
                  {map.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Image
                        src={collaborator.imageUrl}
                        alt={collaborator.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-border"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{collaborator.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{collaborator.permission}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Added {new Date(collaborator.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/users/${collaborator.id}`}>
                          <Eye className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4">
                <p className="text-muted-foreground">No collaborators</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Markers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Markers ({map.content.markers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {map.content.markers.length > 0 ? (
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-2">
                  {map.content.markers.map((marker) => (
                    <div key={marker.id} className="p-2 border rounded">
                      <h4 className="font-medium text-sm">{marker.title}</h4>
                      {marker.description && (
                        <p className="text-xs text-muted-foreground mt-1">{marker.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {marker.lat?.toFixed(6) || 'N/A'}, {marker.lng?.toFixed(6) || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4">
                <p className="text-muted-foreground text-sm">No markers</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Folder className="w-4 h-4" />
              <span>Collections ({map.content.collections.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {map.content.collections.length > 0 ? (
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-2">
                  {map.content.collections.map((collection) => (
                    <div key={collection.id} className="p-2 border rounded">
                      <h4 className="font-medium text-sm">{collection.title}</h4>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground mt-1">{collection.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Created {new Date(collection.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4">
                <p className="text-muted-foreground text-sm">No collections</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Route className="w-4 h-4" />
              <span>Paths ({map.content.paths.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {map.content.paths.length > 0 ? (
              <ScrollArea className="h-[300px] p-4">
                <div className="space-y-2">
                  {map.content.paths.map((path) => (
                    <div key={path.id} className="p-2 border rounded">
                      <h4 className="font-medium text-sm">{path.title}</h4>
                      {path.description && (
                        <p className="text-xs text-muted-foreground mt-1">{path.description}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Created {new Date(path.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-4">
                <p className="text-muted-foreground text-sm">No paths</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}