"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateMockUsers, generateMockMaps, generateMockLoginSessions, generateTimeSeriesData } from "@/lib/mock-data"
import { ArrowLeft, Mail, Calendar, Clock, Map, MapPin, FolderOpen, ChevronRight } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const users = generateMockUsers(50)
  const allMaps = generateMockMaps(100)
  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold text-foreground">User not found</h1>
          <Link href="/users">
            <Button className="mt-4">Back to Users</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const userMaps = allMaps.filter((map) => map.ownerId === user.id)
  const loginSessions = generateMockLoginSessions(user.id, 10)
  const activityData = generateTimeSeriesData(30)

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
              <div className="text-2xl font-bold text-card-foreground">{user.mapsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Created maps</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Total Markers</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{user.markersCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Placed markers</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{user.collectionsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Organized collections</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Last Login</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-card-foreground">
                {formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{format(new Date(user.lastLogin), "PPp")}</p>
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
                    {format(new Date(user.createdAt), "PPP")} (
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })})
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Activity Over Time</CardTitle>
            <CardDescription className="text-muted-foreground">Last 30 days of user activity</CardDescription>
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
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="markers"
                    stroke="var(--color-markers)"
                    strokeWidth={2}
                    dot={false}
                    name="Markers"
                  />
                  <Line
                    type="monotone"
                    dataKey="collections"
                    stroke="var(--color-collections)"
                    strokeWidth={2}
                    dot={false}
                    name="Collections"
                  />
                  <Line
                    type="monotone"
                    dataKey="routes"
                    stroke="var(--color-routes)"
                    strokeWidth={2}
                    dot={false}
                    name="Routes"
                  />
                  <Line
                    type="monotone"
                    dataKey="paths"
                    stroke="var(--color-paths)"
                    strokeWidth={2}
                    dot={false}
                    name="Paths"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
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
                  <Link key={map.id} href={`/maps/${map.id}`}>
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
                            <FolderOpen className="h-3 w-3" />
                            {map.collectionsCount} collections
                          </span>
                          <span>Updated {formatDistanceToNow(new Date(map.updatedAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Login Sessions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Login Sessions</CardTitle>
            <CardDescription className="text-muted-foreground">Last 10 login sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Login Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User Agent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {loginSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-card-foreground">
                          <div>{format(new Date(session.loginAt), "PPp")}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(session.loginAt), { addSuffix: true })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{session.ipAddress}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-md truncate">
                          {session.userAgent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
