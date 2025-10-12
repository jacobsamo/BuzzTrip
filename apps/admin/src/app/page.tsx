"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { Users, Map, MapPin, Database, TrendingUp } from "lucide-react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@buzztrip/ui/components/chart"
import { DateRangePicker } from "@/components/date-range-picker"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"

export default function OverviewPage() {
  // Initialize with last 90 days
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 90)
    return { from, to }
  })

  const overviewStats = useQuery(api.admin.stats.getOverviewStats)
  const growth = useQuery(api.admin.stats.getGrowthMetrics, { days: 30 })
  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)

  // Calculate days from date range
  const days = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 90
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(diffDays, 1)
  }, [dateRange])

  const dailyStats = useQuery(api.admin.charts.getDailyCreationStats, { days })

  // Filter data based on selected date range (must be before early return)
  const filteredChartData = React.useMemo(() => {
    if (!dailyStats || !dateRange?.from || !dateRange?.to) return dailyStats ?? []

    return dailyStats.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!
    })
  }, [dailyStats, dateRange])

  const hasChartData = filteredChartData.length > 0 && filteredChartData.some((d: any) => d.maps > 0 || d.markers > 0)
  const isChartLoading = dailyStats === undefined

  // Calculate visibility distribution (must be before early return)
  const visibilityData = React.useMemo(() => {
    if (!allMaps) return []
    return [
      { name: "Public", value: allMaps.filter((m: any) => m.visibility === "public").length, fill: "#f59e0b" },
      { name: "Private", value: allMaps.filter((m: any) => m.visibility === "private").length, fill: "#3b82f6" },
      { name: "Unlisted", value: allMaps.filter((m: any) => m.visibility === "unlisted").length, fill: "#10b981" },
    ]
  }, [allMaps])

  // Show loading only on initial page load
  if (!overviewStats || !growth || !allMaps) {
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
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-card-foreground">Platform Growth</CardTitle>
              <CardDescription className="text-muted-foreground">
                Daily creation of maps and markers
              </CardDescription>
            </div>
            <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {isChartLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            ) : !hasChartData ? (
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
                    color: "#f59e0b",
                  },
                  markers: {
                    label: "Markers",
                    color: "#3b82f6",
                  },
                }}
                className="aspect-auto h-[300px] w-full"
              >
                <AreaChart data={filteredChartData}>
                  <defs>
                    <linearGradient id="fillMaps" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-maps)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-maps)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMarkers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-markers)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-markers)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    className="stroke-muted-foreground"
                    fontSize={12}
                    tickFormatter={(value) => {
                      const date = new Date(value)
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="markers"
                    type="natural"
                    fill="url(#fillMarkers)"
                    stroke="var(--color-markers)"
                    strokeWidth={2}
                    stackId="a"
                  />
                  <Area
                    dataKey="maps"
                    type="natural"
                    fill="url(#fillMaps)"
                    stroke="var(--color-maps)"
                    strokeWidth={2}
                    stackId="a"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
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
                    color: "#f59e0b",
                  },
                  private: {
                    label: "Private",
                    color: "#3b82f6",
                  },
                  unlisted: {
                    label: "Unlisted",
                    color: "#10b981",
                  },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visibilityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="stroke-muted-foreground" fontSize={12} />
                    <YAxis className="stroke-muted-foreground" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} />
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
