"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Button } from "@buzztrip/ui/components/button"
import { Badge } from "@buzztrip/ui/components/badge"
import { ArrowLeft, Mail, Calendar, Map, MapPin, FolderOpen, Users } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import type { Id } from "@buzztrip/backend/dataModel"

export function UserDetailContent({ userId }: { userId: Id<"users"> }) {
  const user = useQuery(api.users.currentUser) // We'll need to get user by ID
  const userStats = useQuery(api.admin.users.getUserDetailStats, { userId })
  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)

  if (!user || !userStats || !allMaps) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading user details...</p>
        </div>
      </DashboardLayout>
    )
  }

  const userMaps = allMaps.filter((map) => map?.owner && map.owner._id === userId)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground mt-1">User details and activity</p>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Maps</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{userStats.totalMaps}</div>
              <p className="text-xs text-muted-foreground mt-1">Created maps</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Markers</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{userStats.totalMarkers}</div>
              <p className="text-xs text-muted-foreground mt-1">Placed markers</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{userStats.totalCollections}</div>
              <p className="text-xs text-muted-foreground mt-1">Organized collections</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collaborations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{userStats.collaborations}</div>
              <p className="text-xs text-muted-foreground mt-1">Map collaborations</p>
            </CardContent>
          </Card>
        </div>

        {/* User Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-card-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(user._creationTime), "PPP")} (
                    {formatDistanceToNow(new Date(user._creationTime), { addSuffix: true })})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Maps */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Maps ({userMaps.length})</CardTitle>
            <CardDescription className="text-muted-foreground">All maps created by this user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userMaps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No maps created yet</p>
              ) : (
                userMaps.map((map) => (
                  <Link key={map._id} href={`/maps/${map._id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-secondary-foreground">{map.title}</h3>
                          <Badge
                            variant="outline"
                            className="text-xs border-border text-muted-foreground bg-background"
                          >
                            {map.visibility}
                          </Badge>
                        </div>
                        {map.description && <p className="text-sm text-muted-foreground mt-1">{map.description}</p>}
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {map.markersCount} markers
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {map.collaboratorsCount} collaborators
                          </span>
                          <span>Updated {formatDistanceToNow(new Date(map._creationTime), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
