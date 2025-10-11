"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Users, Map, MapPin, Database, TrendingUp } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@buzztrip/ui/components/chart"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"

export default function OverviewPage() {
  const overviewStats = useQuery(api.admin.stats.getOverviewStats)
  const growth = useQuery(api.admin.stats.getGrowthMetrics, { days: 30 })
  const mapsMonthly = useQuery(api.admin.charts.getMapsCreatedByMonth, { months: 12 })
  const markersMonthly = useQuery(api.admin.charts.getMarkersCreatedByMonth, { months: 12 })
  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)

  if (!overviewStats || !growth || !mapsMonthly || !markersMonthly || !allMaps) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  const statsCards = [
    {
      title: "Total Users",
      value: overviewStats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered users",
      change: `${growth.usersGrowth > 0 ? '+' : ''}${growth.usersGrowth}%`,
    },
    {
      title: "Total Maps",
      value: overviewStats.totalMaps.toLocaleString(),
      icon: Map,
      description: "Created maps",
      change: `${growth.mapsGrowth > 0 ? '+' : ''}${growth.mapsGrowth}%`,
    },
    {
      title: "Total Markers",
      value: overviewStats.totalMarkers.toLocaleString(),
      icon: MapPin,
      description: "Placed markers",
      change: `${growth.markersGrowth > 0 ? '+' : ''}${growth.markersGrowth}%`,
    },
    {
      title: "Total Places",
      value: overviewStats.totalPlaces.toLocaleString(),
      icon: Database,
      description: "Unique places",
      change: `${growth.placesGrowth > 0 ? '+' : ''}${growth.placesGrowth}%`,
    },
  ]

  // Combine monthly data for chart - create a lookup object for faster matching
  const markersLookup: Record<string, number> = {}
  markersMonthly.forEach((item: any) => {
    markersLookup[item.month] = item.count
  })

  const monthlyGrowthData = mapsMonthly.map((mapData: any) => ({
    month: mapData.month,
    maps: mapData.count,
    markers: markersLookup[mapData.month] || 0,
  }))

  // Debug logging to verify data
  console.log('Chart Data Debug:', {
    mapsMonthly,
    markersMonthly,
    monthlyGrowthData,
    totalDataPoints: monthlyGrowthData.length,
    hasData: monthlyGrowthData.some((d: any) => d.maps > 0 || d.markers > 0)
  })

  // Check if we have any actual data to display
  const hasChartData = monthlyGrowthData.length > 0 && monthlyGrowthData.some((d: any) => d.maps > 0 || d.markers > 0)

  // Calculate visibility distribution
  const visibilityData = [
    { name: "Public", value: allMaps.filter((m: any) => m.visibility === "public").length, fill: "hsl(var(--chart-1))" },
    { name: "Private", value: allMaps.filter((m: any) => m.visibility === "private").length, fill: "hsl(var(--chart-2))" },
    { name: "Unlisted", value: allMaps.filter((m: any) => m.visibility === "unlisted").length, fill: "hsl(var(--chart-3))" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">Platform statistics and insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <span className={`text-xs flex items-center gap-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Growth Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Platform Growth</CardTitle>
            <CardDescription className="text-muted-foreground">
              Monthly map and marker creation over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasChartData ? (
              <div className="h-[300px] flex items-center justify-center text-center">
                <div>
                  <p className="text-muted-foreground mb-2">No data available yet</p>
                  <p className="text-sm text-muted-foreground">Create some maps and markers to see growth trends</p>
                </div>
              </div>
            ) : (
              <ChartContainer
                config={{
                  maps: {
                    label: "Maps",
                    color: "hsl(var(--chart-1))",
                  },
                  markers: {
                    label: "Markers",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="maps" stroke="var(--color-maps)" strokeWidth={2} name="Maps" />
                    <Line type="monotone" dataKey="markers" stroke="var(--color-markers)" strokeWidth={2} name="Markers" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Map Visibility Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Map Visibility</CardTitle>
              <CardDescription className="text-muted-foreground">Distribution of map privacy settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  public: {
                    label: "Public",
                    color: "hsl(var(--chart-1))",
                  },
                  private: {
                    label: "Private",
                    color: "hsl(var(--chart-2))",
                  },
                  unlisted: {
                    label: "Unlisted",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visibilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {visibilityData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="text-2xl font-bold text-card-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
              <CardDescription className="text-muted-foreground">Navigate to different sections</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <a
                href="/users"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 transition-colors hover:bg-secondary/80"
              >
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium text-secondary-foreground">Manage Users</h3>
                  <p className="text-sm text-muted-foreground">View and manage all users</p>
                </div>
              </a>
              <a
                href="/maps"
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-4 transition-colors hover:bg-secondary/80"
              >
                <Map className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium text-secondary-foreground">Browse Maps</h3>
                  <p className="text-sm text-muted-foreground">Explore all created maps</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
