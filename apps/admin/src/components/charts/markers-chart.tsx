"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MarkersChart() {
  const data = useQuery(api.admin.charts.getMarkersCreatedByMonth, { months: 6 });

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Markers Created</CardTitle>
          <CardDescription>Last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Markers Created</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              className="stroke-muted-foreground"
              fontSize={12}
            />
            <YAxis className="stroke-muted-foreground" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--card))",
                border: "1px solid oklch(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
