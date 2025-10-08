"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/convex/_generated/api";
import { StatCard } from "@/components/dashboard/stat-card";
import { MapsChart } from "@/components/charts/maps-chart";
import { MarkersChart } from "@/components/charts/markers-chart";
import { Users, Map, MapPin, MapPinned } from "lucide-react";

export default function DashboardPage() {
  const stats = useQuery(api.admin.stats.getOverviewStats);
  const growth = useQuery(api.admin.stats.getGrowthMetrics, { days: 7 });

  if (!stats || !growth) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of BuzzTrip platform statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          growth={growth.usersGrowth}
          icon={Users}
        />
        <StatCard
          title="Total Maps"
          value={stats.totalMaps}
          growth={growth.mapsGrowth}
          icon={Map}
        />
        <StatCard
          title="Total Markers"
          value={stats.totalMarkers}
          growth={growth.markersGrowth}
          icon={MapPin}
        />
        <StatCard
          title="Total Places"
          value={stats.totalPlaces}
          growth={growth.placesGrowth}
          icon={MapPinned}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MapsChart />
        <MarkersChart />
      </div>
    </div>
  );
}
