"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Button } from "@buzztrip/ui/components/button"
import { Badge } from "@buzztrip/ui/components/badge"
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
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import type { Id } from "@buzztrip/backend/dataModel"

export function MapDetailContent({ mapId }: { mapId: Id<"maps"> }) {
  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)
  const mapStats = useQuery(api.admin.maps.getMapDetailStats, { mapId })

  if (!allMaps || !mapStats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading map details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const map = allMaps.find((m) => m._id === mapId)?.owner

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
                  {map.owner ? (
                    <Link href={`/users/${map.owner._id}`}>
                      <p className="font-medium text-primary hover:underline">{map.owner.name}</p>
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
                    {format(new Date(map._creationTime), "PPP")} (
                    {formatDistanceToNow(new Date(map._creationTime), { addSuffix: true })})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Content Summary</CardTitle>
              <CardDescription className="text-muted-foreground">Total items on this map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Markers</span>
                  <Badge variant="secondary">{mapStats.markersCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Collections</span>
                  <Badge variant="secondary">{mapStats.collectionsCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Paths</span>
                  <Badge variant="secondary">{mapStats.pathsCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Routes</span>
                  <Badge variant="secondary">{mapStats.routesCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Labels</span>
                  <Badge variant="secondary">{mapStats.labelsCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Collaborators</span>
                  <Badge variant="secondary">{mapStats.collaboratorsCount}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
