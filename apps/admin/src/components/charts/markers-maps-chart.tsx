"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { api } from "@buzztrip/backend/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@buzztrip/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@buzztrip/ui/components/chart";
import { useQuery } from "convex/react";
import * as React from "react";
import { DateRange } from "react-day-picker";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  markers: {
    label: "Markers",
    color: "var(--chart-1)",
  },
  maps: {
    label: "Maps",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MapMarkersChart() {
  // Initialize with last 90 days
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - 90);
      return { from, to };
    }
  );

  // Calculate days from date range
  const days = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 90;
    const diffTime = Math.abs(
      dateRange.to.getTime() - dateRange.from.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 1);
  }, [dateRange]);

  const dailyStats = useQuery(api.admin.charts.getDailyCreationStats, { days });

  // Filter data based on selected date range (must be before early return)
  const filteredChartData = React.useMemo(() => {
    if (!dailyStats || !dateRange?.from || !dateRange?.to)
      return dailyStats ?? [];

    return dailyStats.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from! && itemDate <= dateRange.to!;
    });
  }, [dailyStats, dateRange]);

  const hasChartData =
    filteredChartData.length > 0 &&
    filteredChartData.some((d: any) => d.maps > 0 || d.markers > 0);
  const isChartLoading = dailyStats === undefined;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-card-foreground">
            Platform Growth
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Daily creation of maps and markers
          </CardDescription>
        </div>
        <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[300px]">
        {isChartLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : !hasChartData ? (
          <div className="h-[300px] flex items-center justify-center text-center">
            <div>
              <p className="text-muted-foreground mb-2">
                No data available yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create some maps and markers to see growth trends
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-full w-full"
          >
            <AreaChart data={filteredChartData}>
              <defs>
                <linearGradient id="fillMaps" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMarkers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
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
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-AU", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              {/* <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={5}
                  /> */}
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-AU", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="markers"
                type="natural"
                fill="var(--chart-1)"
                fillOpacity={0.4}
                stroke="var(--chart-1)"
                stackId="a"
              />
              <Area
                dataKey="maps"
                type="natural"
                fill="var(--chart-2)"
                fillOpacity={0.4}
                stroke="var(--chart-2)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
