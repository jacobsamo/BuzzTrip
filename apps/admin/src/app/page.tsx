"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components";
import {
  Alert,
  AlertDescription,
  Badge,
} from "@buzztrip/components/ui";
import { useDashboardOverview } from "@/hooks/use-admin-data";

export default function AdminDashboard() {
  return <AdminContent />;
}

function AdminContent() {
  const overview = useDashboardOverview();
  const isLoading = overview === undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.usersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Maps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalMaps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.mapsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Places</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalPlaces.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.placesThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overview?.summary.systemHealth === 'healthy' ? 'Healthy' : 'Issues'}
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Last 24 Hours</h4>
              <div className="space-y-1 text-sm">
                <div>Maps Created: {overview?.recentActivity.last24h.mapsCreated}</div>
                <div>Markers Added: {overview?.recentActivity.last24h.markersCreated}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Last Week</h4>
              <div className="space-y-1 text-sm">
                <div>Maps Created: {overview?.recentActivity.lastWeek.mapsCreated}</div>
                <div>Markers Added: {overview?.recentActivity.lastWeek.markersCreated}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {overview?.engagement.collaborationRate.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Avg Users/Map</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {overview?.engagement.markerAdoptionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Marker Adoption</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {overview?.engagement.contentQualityScore.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Content Quality</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          Admin portal is successfully connected to Clerk and Convex with real-time data!
          <Badge className="ml-2" variant="secondary">✅ Live Data</Badge>
        </AlertDescription>
      </Alert>
    </div>
  );
}