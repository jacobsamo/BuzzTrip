"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import { MapsListTable } from "@/components/shared/maps-list-table"

export default function MapsPage() {
  const allMaps = useQuery(api.admin.maps.getAllMapsWithStats)

  if (!allMaps) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading maps...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Maps</h1>
          <p className="text-muted-foreground mt-1">Browse and manage all maps</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Maps ({allMaps.length})</CardTitle>
            <CardDescription className="text-muted-foreground">
              Search, filter, and manage all created maps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MapsListTable
              maps={allMaps}
              enableSorting
              enablePagination
              pageSize={10}
              showActions
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
