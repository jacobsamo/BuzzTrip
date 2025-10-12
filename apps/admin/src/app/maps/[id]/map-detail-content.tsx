"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Button } from "@buzztrip/ui/components/button"
import { Badge } from "@buzztrip/ui/components/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@buzztrip/ui/components/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@buzztrip/ui/components/table"
import { DateRangePicker } from "@/components/date-range-picker"
import { MapsListTable } from "@/components/shared/maps-list-table"
import {
  ArrowLeft,
  MapPin,
  FolderOpen,
  Pencil,
  Users,
  Globe,
  Lock,
  EyeOff,
  Calendar,
  Eye,
  MapPinned,
  TrendingUp,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import type { Id } from "@buzztrip/backend/dataModel"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export function MapDetailContent({ mapId }: { mapId: Id<"maps"> }) {
  // Initialize with last 30 days
  const [creationDateRange, setCreationDateRange] = React.useState<DateRange | undefined>(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return { from, to }
  })

  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)
  const mapStats = useQuery(api.admin.maps.getMapDetailStats, { mapId })
  const mapViewAnalytics = useQuery(api.admin.maps.getMapViewAnalytics, { mapId })
  const markers = useQuery(api.admin.maps.getMapMarkers, { mapId })
  const paths = useQuery(api.admin.maps.getMapPaths, { mapId })
  const collaborators = useQuery(api.admin.maps.getMapCollaborators, { mapId })
  const creationTimeline = useQuery(api.admin.maps.getMapCreationTimeline, { mapId })

  // Filter creation timeline data based on selected date range (must be before early return)
  const filteredCreationData = React.useMemo(() => {
    if (!creationTimeline?.dailyCreations || !creationDateRange?.from || !creationDateRange?.to) {
      return creationTimeline?.dailyCreations ?? []
    }

    return creationTimeline.dailyCreations.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= creationDateRange.from! && itemDate <= creationDateRange.to!
    })
  }, [creationTimeline, creationDateRange])

  if (!allMaps || !mapStats || !mapViewAnalytics || !markers || !paths || !collaborators || !creationTimeline) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading map details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const mapData = allMaps.find((m) => m._id === mapId)

  if (!mapData) {
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
              <h1 className="text-3xl font-semibold text-foreground">{mapData.title}</h1>
              <Badge variant="outline" className="border-border text-muted-foreground bg-background">
                {getVisibilityIcon(mapData.visibility)}
                <span className="ml-1">{mapData.visibility}</span>
              </Badge>
            </div>
            {mapData.description && <p className="text-muted-foreground mt-1">{mapData.description}</p>}
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapViewAnalytics.totalViews}</div>
              <p className="text-xs text-muted-foreground mt-1">All time views</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Unique Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapViewAnalytics.uniqueUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Distinct viewers</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Last Accessed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-card-foreground">
                {mapViewAnalytics.lastAccessed
                  ? formatDistanceToNow(new Date(mapViewAnalytics.lastAccessed), { addSuffix: true })
                  : "Never"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Most recent view</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Markers</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapStats.markersCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapStats.collectionsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Paths</CardTitle>
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapStats.pathsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Labels</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapStats.labelsCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collaborators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{mapStats.collaboratorsCount}</div>
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
                  {mapData.owner ? (
                    <Link href={`/users/${mapData.owner._id}`}>
                      <p className="font-medium text-primary hover:underline">{mapData.owner.name}</p>
                    </Link>
                  ) : (
                    <p className="font-medium text-card-foreground">Unknown</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(mapData._creationTime), "PPP")} (
                    {formatDistanceToNow(new Date(mapData._creationTime), { addSuffix: true })})
                  </p>
                </div>
              </div>
              {mapData.location_name && (
                <div className="flex items-center gap-3">
                  <MapPinned className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-card-foreground">{mapData.location_name}</p>
                  </div>
                </div>
              )}
              {mapData.lat && mapData.lng && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p className="font-medium text-card-foreground font-mono text-xs">
                      {mapData.lat.toFixed(6)}, {mapData.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
              {mapData.mapTypeId && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Map Type</p>
                    <p className="font-medium text-card-foreground capitalize">{mapData.mapTypeId}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collaborators Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaborators ({collaborators.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">People who have access to this map</CardDescription>
            </CardHeader>
            <CardContent>
              {collaborators.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {collaborators.map((collab) => (
                    <Link key={collab._id} href={`/users/${collab.user_id}`}>
                      <Card className="bg-background border-border hover:border-primary transition-colors cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={collab.userImage || undefined} />
                              <AvatarFallback className="text-xs">
                                {collab.userName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-card-foreground truncate text-sm">
                                {collab.userName || "Unknown User"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{collab.userEmail}</p>
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {collab.permission}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No collaborators found</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Graphs */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Page Views Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Page Views
              </CardTitle>
              <CardDescription className="text-muted-foreground">Last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {mapViewAnalytics.dailyViews.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mapViewAnalytics.dailyViews}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      className="stroke-muted-foreground"
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis className="stroke-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(var(--card))",
                        border: "1px solid oklch(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      labelFormatter={(value) => format(new Date(value), "PPP")}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorViews)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No view data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marker & Path Creation Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Content Creation
                </CardTitle>
                <CardDescription className="text-muted-foreground">Markers and paths created over time</CardDescription>
              </div>
              <DateRangePicker range={creationDateRange} onRangeChange={setCreationDateRange} />
            </CardHeader>
            <CardContent className="pt-6">
              {filteredCreationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={filteredCreationData}>
                    <defs>
                      <linearGradient id="colorMarkers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPaths" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      className="stroke-muted-foreground"
                      fontSize={12}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis className="stroke-muted-foreground" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(var(--card))",
                        border: "1px solid oklch(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                      labelFormatter={(value) => format(new Date(value), "PPP")}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="markers"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorMarkers)"
                      name="Markers"
                    />
                    <Area
                      type="monotone"
                      dataKey="paths"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPaths)"
                      name="Paths"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No creation data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Markers & Paths Tables */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Markers Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Markers ({markers.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">All markers on this map</CardDescription>
            </CardHeader>
            <CardContent>
              {markers.length > 0 ? (
                <div className="rounded-md border border-border max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {markers.map((marker) => (
                        <TableRow key={marker._id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: marker.color }}
                              />
                              <span className="truncate">{marker.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link href={`/users/${marker.created_by}`} className="text-primary hover:underline">
                              {marker.creatorName || "Unknown"}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDistanceToNow(new Date(marker._creationTime), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No markers found</div>
              )}
            </CardContent>
          </Card>

          {/* Paths Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Paths ({paths.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">All paths on this map</CardDescription>
            </CardHeader>
            <CardContent>
              {paths.length > 0 ? (
                <div className="rounded-md border border-border max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paths.map((path) => (
                        <TableRow key={path._id}>
                          <TableCell className="font-medium">
                            <span className="truncate">{path.title}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {path.pathType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/users/${path.createdBy}`} className="text-primary hover:underline">
                              {path.creatorName || "Unknown"}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatDistanceToNow(new Date(path._creationTime), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No paths found</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Other Maps by Owner */}
        {mapData.owner && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <MapPinned className="h-5 w-5" />
                Other Maps by {mapData.owner.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Browse other maps created by this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MapsListTable
                maps={allMaps.filter((m) => m.owner?._id === mapData.owner_id && m._id !== mapId)}
                maxHeight="500px"
                emptyMessage="No other maps by this owner"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
