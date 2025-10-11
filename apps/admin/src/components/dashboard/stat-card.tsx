import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/ui/components/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  growth: number;
  icon: LucideIcon;
}

export function StatCard({ title, value, growth, icon: Icon }: StatCardProps) {
  const isPositive = growth >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <div className="flex items-center gap-1 text-xs mt-1">
          <TrendIcon
            className={`h-3 w-3 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          />
          <span
            className={isPositive ? "text-green-600" : "text-red-600"}
          >
            {Math.abs(growth)}%
          </span>
          <span className="text-muted-foreground">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}
