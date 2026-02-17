"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Button } from "@buzztrip/ui/components/button"
import { Badge } from "@buzztrip/ui/components/badge"
import { MapsListTable } from "@/components/shared/maps-list-table"
import {
  ArrowLeft,
  Mail,
  Calendar,
  Map,
  MapPin,
  FolderOpen,
  Users,
  User,
  Route,
  Tag,
  Star,
  Eye,
  Activity
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import type { Id } from "@buzztrip/backend/dataModel"

export function UserDetailContent({ userId }: { userId: Id<"users"> }) {
  const user = useQuery(api.admin.users.getUserById, { userId })
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

        {/* User Profile Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                    {user.username && (
                      <Badge variant="secondary" className="font-mono">
                        @{user.username}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.bio && <p className="text-sm text-foreground mt-2">{user.bio}</p>}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {user.firstName && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">First Name</p>
                    <p className="font-medium text-card-foreground">{user.firstName}</p>
                  </div>
                </div>
              )}
              {user.lastName && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Name</p>
                    <p className="font-medium text-card-foreground">{user.lastName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium text-card-foreground">
                    {format(new Date(user._creationTime), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Overview */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Activity Statistics</h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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
                <CardTitle className="text-sm font-medium text-card-foreground">Markers</CardTitle>
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
                <p className="text-xs text-muted-foreground mt-1">Organized</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Paths</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.totalPaths}</div>
                <p className="text-xs text-muted-foreground mt-1">Drawn paths</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Routes</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.totalRoutes}</div>
                <p className="text-xs text-muted-foreground mt-1">Created routes</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Labels</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.totalLabels}</div>
                <p className="text-xs text-muted-foreground mt-1">Custom labels</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Reviews</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.totalReviews}</div>
                <p className="text-xs text-muted-foreground mt-1">Place reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Collaborations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.collaborations}</div>
                <p className="text-xs text-muted-foreground mt-1">Maps shared</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Map Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{userStats.totalMapViews}</div>
                <p className="text-xs text-muted-foreground mt-1">Total views</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Engagement Summary */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Engagement Summary</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Content Creation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Maps</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalMaps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Markers</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalMarkers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Collections</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalCollections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Paths Drawn</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalPaths}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Map Views</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalMapViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Collaborations</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.collaborations}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Place Reviews</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalReviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Routes Created</span>
                  </div>
                  <span className="font-semibold text-foreground">{userStats.totalRoutes}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User's Maps */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Map className="h-5 w-5" />
              Created Maps ({userMaps.length})
            </CardTitle>
            <CardDescription className="text-muted-foreground">All maps owned by this user</CardDescription>
          </CardHeader>
          <CardContent>
            <MapsListTable maps={userMaps} maxHeight="600px" enableSorting={true} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
