"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  generateMockMaps,
  generateMockMarkers,
  generateMockCollections,
  generateMockCollaborators,
  generateTimeSeriesData,
} from "@/lib/mock-data"
import { ArrowLeft, MapPin, FolderOpen, Route, Pencil, Users, Globe, Lock, EyeOff, Calendar, Clock } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MapDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MapDetailPage({ params }: MapDetailPageProps) {
  const { id } = await params
  const allMaps = generateMockMaps(100)
  const map = allMaps.find((m) => m.id === id)

  if (!map) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold text-foreground">Map not found</h1>
          <Link href="/maps">
            <Button className="mt-4">Back to Maps</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const markers = generateMockMarkers(map.id, map.markersCount)
  const collections = generateMockCollections(map.id, map.collectionsCount)
  const collaborators = generateMockCollaborators(map.id, map.collaboratorsCount)
  const activityData = generateTimeSeriesData(30)

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-5 w-5" />
      case "private":
        return <Lock className="h-5 w-5" />
      case "unlisted":
        return <EyeOff className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/maps">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-foreground">{map.title}</h1>
              <Badge variant="outline" className="border-border text-muted-foreground bg-background">
                {getVisibilityIcon(map.visibility)}
                <span className="ml-1">{map.visibility}</span>
              </Badge>
            </div>
            {map.description && <p className="text-muted-foreground mt-1">{map.description}</p>}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Markers</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{map.markersCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{map.collectionsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Routes</CardTitle>
              <Route className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{map.routesCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Paths</CardTitle>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{map.pathsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Collaborators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{map.collaboratorsCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Map Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Map Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <Link href={`/users/${map.ownerId}`}>
                    <p className="font-medium text-primary hover:underline">{map.ownerName}</p>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(map.createdAt), "PPP")} (
                    {formatDistanceToNow(new Date(map.createdAt), { addSuffix: true })})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(map.updatedAt), "PPP")} (
                    {formatDistanceToNow(new Date(map.updatedAt), { addSuffix: true })})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collaborators */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Collaborators ({collaborators.length})</CardTitle>
              <CardDescription className="text-muted-foreground">Users with access to this map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborators.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No collaborators</p>
                ) : (
                  collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                      <div>
                        <Link href={`/users/${collab.userId}`}>
                          <p className="font-medium text-secondary-foreground hover:text-primary">{collab.userName}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground">{collab.userEmail}</p>
                      </div>
                      <Badge variant="secondary" className="bg-background text-muted-foreground">
                        {collab.permission}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Content Creation Timeline</CardTitle>
            <CardDescription className="text-muted-foreground">
              Daily content additions over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                markers: {
                  label: "Markers",
                  color: "hsl(var(--chart-1))",
                },
                collections: {
                  label: "Collections",
                  color: "hsl(var(--chart-2))",
                },
                routes: {
                  label: "Routes",
                  color: "hsl(var(--chart-3))",
                },
                paths: {
                  label: "Paths",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="markers" fill="var(--color-markers)" name="Markers" />
                  <Bar dataKey="collections" fill="var(--color-collections)" name="Collections" />
                  <Bar dataKey="routes" fill="var(--color-routes)" name="Routes" />
                  <Bar dataKey="paths" fill="var(--color-paths)" name="Paths" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Markers */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Markers ({markers.length})</CardTitle>
            <CardDescription className="text-muted-foreground">All markers placed on this map</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {markers.slice(0, 10).map((marker) => (
                      <tr key={marker.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-card-foreground">{marker.title}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                          {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{marker.createdBy}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(marker.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {markers.length > 10 && (
              <p className="text-sm text-muted-foreground text-center mt-4">Showing 10 of {markers.length} markers</p>
            )}
          </CardContent>
        </Card>

        {/* Collections */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Collections ({collections.length})</CardTitle>
            <CardDescription className="text-muted-foreground">Organized marker collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collections.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No collections created yet</p>
              ) : (
                collections.map((collection) => (
                  <div key={collection.id} className="p-4 rounded-lg border border-border bg-secondary">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary-foreground">{collection.title}</h3>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{collection.markersCount} markers</span>
                          <span>Created by {collection.createdBy}</span>
                          <span>{formatDistanceToNow(new Date(collection.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
