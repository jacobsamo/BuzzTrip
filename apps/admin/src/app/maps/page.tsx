"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/api";
import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components/ui";
import { MapsTable } from "@/components/tables/maps-table";

export default function MapsPage() {
  const maps = useQuery(api.admin.maps.getAllMapsWithStats);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Maps</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all BuzzTrip maps
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Maps</CardTitle>
        </CardHeader>
        <CardContent>
          {!maps ? (
            <div className="text-muted-foreground">Loading maps...</div>
          ) : (
            <MapsTable data={maps} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
