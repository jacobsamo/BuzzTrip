"use client"

import * as React from "react"
import { DateRange } from "react-day-picker"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@buzztrip/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@buzztrip/ui/components/chart"
import { DateRangePicker } from "./date-range-picker"

interface AnalyticsChartWithDatePickerProps {
  data: Array<{ date: string; value: number }>
  title?: string
  description?: string
  valueLabel?: string
}

export function AnalyticsChartWithDatePicker({
  data,
  title = "Analytics",
  description = "Showing data for selected period",
  valueLabel = "Value",
}: AnalyticsChartWithDatePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    // Default to last 30 days
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return { from, to }
  })

  const filteredData = React.useMemo(() => {
    if (!range?.from && !range?.to) {
      return data
    }

    return data.filter((item) => {
      const date = new Date(item.date)
      const from = range.from ? new Date(range.from) : null
      const to = range.to ? new Date(range.to) : null

      if (from && to) {
        return date >= from && date <= to
      } else if (from) {
        return date >= from
      } else if (to) {
        return date <= to
      }
      return true
    })
  }, [data, range])

  const total = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.value, 0)
  }, [filteredData])

  const chartConfig = {
    value: {
      label: valueLabel,
      color: "#8b5cf6",
    },
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-0 border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <DateRangePicker range={range} onRangeChange={setRange} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
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
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="value"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No data available for selected range
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 border-t pt-4">
        <div className="flex gap-2 font-medium leading-none">
          Total: <span className="font-bold">{total.toLocaleString()}</span> {valueLabel.toLowerCase()}
        </div>
        <div className="text-sm text-muted-foreground">
          {range?.from && range?.to
            ? `Showing data from ${range.from.toLocaleDateString()} to ${range.to.toLocaleDateString()}`
            : "Select a date range to filter data"}
        </div>
      </CardFooter>
    </Card>
  )
}
