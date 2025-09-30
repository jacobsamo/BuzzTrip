"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/components";
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
} from "@buzztrip/components/ui";
import {
  useDashboardOverview,
  useConvexUsers,
  useUserStats,
  useMapStats,
  useDetailedMaps,
  useActivityMetrics,
  useGlobalStats,
  useMapItemsAnalytics
} from "@/hooks/use-admin-data";
import { DashboardSkeleton, UsersPageSkeleton, MapsPageSkeleton } from "@/components/skeleton-ui";
import {
  Users,
  Map,
  MapPin,
  Globe,
  Activity,
  TrendingUp,
  AreaChart as AreaChartIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Eye,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Interfaces
interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
  role: string | null;
  banned: boolean;
  mapsCreated?: number;
  collaborations?: number;
  totalActivity?: number;
}

interface MapData {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  markerCount: number;
  collaboratorCount: number;
  isPublic: boolean;
  visibility: string;
  createdAt: number;
  lastModified: number;
  status: string;
  description: string;
}

// Additional interfaces for analytics components
interface UserStats {
  totalUsers: number;
  usersLast24h: number;
  usersLastWeek: number;
  usersLastMonth: number;
  usersLast3Months: number;
  dailyGrowthRate: number;
  weeklyGrowthRate: number;
  monthlyGrowthRate: number;
  retentionRate: number;
  averageUsersPerDay: number;
  registrationTrends: Array<{ date: string | undefined; count: number; dayOfWeek: number; weekNumber: number }>;
  weeklyTrends: Array<{ week: string; count: number; startDate: string | undefined }>;
  isGrowthAccelerating: boolean;
}

interface MapStats {
  totalMaps: number;
  mapsLastMonth: number;
  publicMaps: number;
  mapGrowthRate: number;
  contentStats: {
    totalMarkers?: number;
    totalCollections?: number;
    totalPaths?: number;
  };
  averageCollaboratorsPerMap: number;
  engagementStats: {
    collaborationRate: number;
  };
  creationTrends: Array<{ date: string; count: number }>;
}

interface ActivityMetrics {
  engagementMetrics: {
    activeUserRate: number;
    averageActivityPerUser: number;
  };
  contentVelocity: number;
  featureUsage: {
    markerAdoption: number;
    collectionAdoption: number;
    pathAdoption: number;
    collaborationAdoption: number;
  };
  creationByHour: number[];
  peakActivity: {
    hour: number;
    day: number;
  };
  userSegmentation: {
    activeUsers: number;
    powerUsers: number;
    collaborativeUsers: number;
    totalUsers: number;
  };
}

interface GlobalStats {
  quality: {
    reviewQualityScore: number;
  };
  contentTrends: Array<{ date: string; places: number; reviews: number; photos: number }>;
}

const columnHelperUsers = createColumnHelper<AdminUser>();
const columnHelperMaps = createColumnHelper<MapData>();

export default function AdminDashboard() {
  return <AdminContent />;
}

function AdminContent() {
  const overview = useDashboardOverview();
  const userStats = useUserStats();
  const mapStats = useMapStats();
  const activityMetrics = useActivityMetrics();
  const globalStats = useGlobalStats();
  const convexUsers = useConvexUsers();
  const detailedMaps = useDetailedMaps();
  const mapItemsAnalytics = useMapItemsAnalytics();

  // Comprehensive loading state - wait for all critical data
  const isOverviewLoading = overview === undefined;
  const isUsersDataLoading = convexUsers === undefined || userStats === undefined;
  const isMapsDataLoading = detailedMaps === undefined || mapStats === undefined || mapItemsAnalytics === undefined;
  const isAnalyticsDataLoading = activityMetrics === undefined || globalStats === undefined || mapItemsAnalytics === undefined;

  if (isOverviewLoading) {
    return <DashboardSkeleton />;
  }

  // Use real data from Convex for charts
  const chartData = userStats?.registrationTrends?.slice(-6).map((trend, index) => {
    const mapTrend = mapStats?.creationTrends?.[index];
    return {
      month: new Date(trend.date || Date.now()).toLocaleDateString('en-US', { month: 'short' }),
      users: trend.count || 0,
      maps: mapTrend?.count || 0,
    };
  }) || [];

  const activityData = [
    { name: "Maps", value: overview?.recentActivity?.lastWeek?.mapsCreated || 0 },
    { name: "Markers", value: overview?.recentActivity?.lastWeek?.markersCreated || 0 },
    { name: "Users", value: overview?.growth?.usersThisMonth || 0 },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">BuzzTrip Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Complete overview and management of users, maps, and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="overview" className="text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm font-medium" disabled={isUsersDataLoading}>
            <div className="flex items-center gap-2">
              Users
              {isUsersDataLoading && (
                <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="maps" className="text-sm font-medium" disabled={isMapsDataLoading}>
            <div className="flex items-center gap-2">
              Maps
              {isMapsDataLoading && (
                <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm font-medium" disabled={isAnalyticsDataLoading}>
            <div className="flex items-center gap-2">
              Analytics
              {isAnalyticsDataLoading && (
                <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview
            overview={overview}
            chartData={chartData}
            activityData={activityData}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {isUsersDataLoading ? (
            <UsersPageSkeleton />
          ) : (
            <UsersManagement
              users={convexUsers}
              userStats={userStats}
              isLoading={false}
            />
          )}
        </TabsContent>

        <TabsContent value="maps" className="space-y-4">
          {isMapsDataLoading ? (
            <MapsPageSkeleton />
          ) : (
            <MapsManagement
              maps={detailedMaps}
              mapStats={mapStats as MapStats | undefined}
              isLoading={false}
            />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {isAnalyticsDataLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-8 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-6 bg-muted animate-pulse rounded mb-4" />
                      <div className="h-80 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <AnalyticsView
              userStats={userStats as UserStats | undefined}
              activityMetrics={activityMetrics}
              globalStats={globalStats as GlobalStats | undefined}
              isLoading={false}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Dashboard Overview interfaces
interface OverviewData {
  summary: {
    totalUsers: number;
    totalMaps: number;
    totalPlaces: number;
    systemHealth: string;
  };
  growth: {
    usersThisMonth: number;
    mapsThisMonth: number;
    placesThisMonth: number;
  };
  engagement: {
    collaborationRate: number;
    contentQualityScore: number;
    markerAdoptionRate: number;
  };
  recentActivity: {
    lastWeek: {
      mapsCreated: number;
      markersCreated: number;
    };
  };
}

interface ChartDataItem {
  month: string;
  users: number;
  maps: number;
}

interface ActivityDataItem {
  name: string;
  value: number;
}

// Dashboard Overview Component
function DashboardOverview({ overview, chartData, activityData }: {
  overview: OverviewData | undefined;
  chartData: ChartDataItem[];
  activityData: ActivityDataItem[];
}) {
  return (
    <>
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.usersThisMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maps</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalMaps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.mapsThisMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Places</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview?.summary.totalPlaces.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{overview?.growth.placesThisMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="maps"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Activity from the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.engagement?.collaborationRate?.toFixed(1) || '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average users per map
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min((overview?.engagement?.collaborationRate || 0) * 20, 100)}%`,
                      backgroundColor: 'hsl(var(--chart-2))'
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {overview?.engagement?.collaborationRate?.toFixed(1) || '0.0'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.engagement?.contentQualityScore?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Content quality rating
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${overview?.engagement?.contentQualityScore || 0}%`,
                      backgroundColor: 'hsl(var(--chart-3))'
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {overview?.engagement?.contentQualityScore?.toFixed(0) || '0'}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adoption Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.engagement?.markerAdoptionRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Marker feature adoption
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${overview?.engagement?.markerAdoptionRate || 0}%`,
                      backgroundColor: 'hsl(var(--chart-4))'
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {overview?.engagement?.markerAdoptionRate?.toFixed(0) || '0'}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Users Management Component
function UsersManagement({ users, userStats, isLoading }: {
  users: AdminUser[] | undefined;
  userStats: UserStats | undefined;
  isLoading: boolean;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = useMemo(
    () => [
      columnHelperUsers.accessor('firstName', {
        id: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ row }) => {
          const user = row.original;
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          return (
            <div className="flex items-center space-x-3">
              <Image
                src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt={fullName || user.email}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-border"
              />
              <div>
                <Link
                  href={`/users/${user.id}`}
                  className="text-primary hover:text-primary/80 font-medium hover:underline"
                >
                  {fullName || user.email}
                </Link>
                {fullName && (
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                )}
              </div>
            </div>
          );
        },
      }),
      columnHelperUsers.accessor('mapsCreated', {
        header: 'Maps',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="text-xs">
            {getValue() || 0}
          </Badge>
        ),
      }),
      columnHelperUsers.accessor('collaborations', {
        header: 'Collaborations',
        cell: ({ getValue }) => (
          <Badge variant="outline" className="text-xs">
            {getValue() || 0}
          </Badge>
        ),
      }),
      columnHelperUsers.accessor('role', {
        header: 'Role',
        cell: ({ getValue }) => (
          <Badge variant={getValue() === 'admin' ? 'default' : 'secondary'}>
            {getValue() || 'user'}
          </Badge>
        ),
      }),
      columnHelperUsers.accessor('createdAt', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Joined
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelperUsers.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/users/${row.original.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: users || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  if (isLoading) {
    return <UsersPageSkeleton />;
  }

  return (
    <>
      {/* User Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats?.usersLastMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.usersLastWeek.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {userStats?.weeklyGrowthRate}% weekly growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Users who created content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.averageUsersPerDay}</div>
            <p className="text-xs text-muted-foreground">
              New users per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <Button
              variant="outline"
              onClick={() => {
                setGlobalFilter('');
                setColumnFilters([]);
              }}
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Users ({table.getFilteredRowModel().rows.length} of {users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="border-b border-border">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  ⟪
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ⟨
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  ⟩
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  ⟫
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Maps Management Component
function MapsManagement({ maps, mapStats, isLoading }: {
  maps: MapData[] | undefined;
  mapStats: MapStats | undefined;
  isLoading: boolean;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = useMemo(
    () => [
      columnHelperMaps.accessor('title', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Map Title
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ row }) => (
          <Link
            href={`/maps/${row.original.id}`}
            className="text-primary hover:text-primary/80 font-medium hover:underline"
          >
            {row.getValue('title')}
          </Link>
        ),
      }),
      columnHelperMaps.accessor('creator.name', {
        id: 'creator',
        header: 'Creator',
        cell: ({ row }) => (
          <Link
            href={`/users/${row.original.creator.id}`}
            className="text-primary hover:text-primary/80 hover:underline"
          >
            {row.original.creator.name}
          </Link>
        ),
      }),
      columnHelperMaps.accessor('markerCount', {
        header: 'Items',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="text-xs font-medium">
            {getValue()} markers
          </Badge>
        ),
      }),
      columnHelperMaps.accessor('collaboratorCount', {
        header: 'Collaborators',
        cell: ({ getValue }) => (
          <Badge variant="outline" className="text-xs">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelperMaps.accessor('isPublic', {
        header: 'Visibility',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Public' : 'Private'}
          </Badge>
        ),
        filterFn: (row, columnId, filterValue): boolean => {
          if (!filterValue || filterValue === 'all') return true;
          const isPublic = row.getValue(columnId) as boolean;
          return filterValue === 'public' ? isPublic : !isPublic;
        },
      }),
      columnHelperMaps.accessor('createdAt', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Created
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ getValue }) => formatDate(getValue()),
      }),
      columnHelperMaps.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              asChild
            >
              <Link href={`/maps/${row.original.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: maps || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
  });

  if (isLoading) {
    return <MapsPageSkeleton />;
  }

  return (
    <>
      {/* Maps Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Maps</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapStats?.totalMaps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{mapStats?.mapsLastMonth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Maps</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapStats?.publicMaps.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mapStats?.mapGrowthRate.toFixed(1)}% growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((mapStats?.contentStats?.totalMarkers || 0) + (mapStats?.contentStats?.totalCollections || 0) + (mapStats?.contentStats?.totalPaths || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Markers, collections, paths
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaboration Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapStats?.averageCollaboratorsPerMap.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {mapStats?.engagementStats.collaborationRate}% collaborative
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maps Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Maps ({table.getFilteredRowModel().rows.length} of {maps?.length || 0})
            <span className="ml-4">
              <Input
                placeholder="Search maps..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm inline-flex"
              />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="border-b border-border">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No maps found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  ⟪
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  ⟨
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  ⟩
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  ⟫
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Analytics View Component
function AnalyticsView({ userStats, activityMetrics, globalStats, isLoading }: {
  userStats: UserStats | undefined;
  activityMetrics: ActivityMetrics | undefined;
  globalStats: GlobalStats | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  // Prepare chart data
  const userGrowthData = userStats?.registrationTrends?.slice(-14).map((trend) => ({
    date: new Date(trend.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: trend.count,
  })) || [];

  const featureAdoptionData = [
    { name: 'Markers', value: activityMetrics?.featureUsage?.markerAdoption || 0 },
    { name: 'Collections', value: activityMetrics?.featureUsage?.collectionAdoption || 0 },
    { name: 'Paths', value: activityMetrics?.featureUsage?.pathAdoption || 0 },
    { name: 'Collaboration', value: activityMetrics?.featureUsage?.collaborationAdoption || 0 },
  ];

  return (
    <>
      {/* Analytics Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityMetrics?.engagementMetrics?.activeUserRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Active user rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityMetrics?.contentVelocity || 0}</div>
            <p className="text-xs text-muted-foreground">Items per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Excellent</div>
            <p className="text-xs text-muted-foreground">
              Quality score: {globalStats?.quality?.reviewQualityScore || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <AreaChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.monthlyGrowthRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Monthly user growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Daily user registrations over the last 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption</CardTitle>
            <CardDescription>Percentage of maps using each feature</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureAdoptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak Activity Hour</span>
                <Badge>{activityMetrics?.peakActivity?.hour || 0}:00</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak Activity Day</span>
                <Badge>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][activityMetrics?.peakActivity?.day || 0]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Activity/User</span>
                <Badge variant="outline">{activityMetrics?.engagementMetrics?.averageActivityPerUser || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Content Quality</span>
                <Badge variant="secondary">{globalStats?.quality?.reviewQualityScore || 0}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <Badge variant="default">{activityMetrics?.userSegmentation?.activeUsers || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Power Users</span>
                <Badge variant="secondary">{activityMetrics?.userSegmentation?.powerUsers || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Collaborative Users</span>
                <Badge variant="outline">{activityMetrics?.userSegmentation?.collaborativeUsers || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Users</span>
                <Badge>{activityMetrics?.userSegmentation?.totalUsers || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}