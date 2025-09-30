import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  Eye,
  Activity,
  TrendingUp,
  Globe,
  AreaChart as AreaChartIcon,
  Map,
  MapPin,
  Users,
} from "lucide-react";
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@buzztrip/components/ui";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Simple skeleton component
const MapsPageSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
    <div className="h-96 bg-muted animate-pulse rounded-lg" />
  </div>
);

type MapData = {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
  };
  markerCount: number;
  collectionCount: number;
  pathCount: number;
  collaboratorCount: number;
  isPublic: boolean;
  createdAt: number;
};

const columnHelperMaps = createColumnHelper<MapData>();
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Maps Management Component
interface MapStats {
  totalMaps: number;
  mapsLastMonth: number;
  publicMaps: number;
  mapGrowthRate: number;
  contentStats: {
    totalMarkers: number;
    totalCollections: number;
    totalPaths: number;
  };
  averageCollaboratorsPerMap: number;
  engagementStats: {
    collaborationRate: number;
  };
  creationTrends: Array<{ date: string; count: number }>;
}

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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Items
            {column.getIsSorted() === "asc" ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        ),
        cell: ({ getValue, row }) => {
          const totalItems = getValue() + (row.original as MapData).collectionCount + (row.original as MapData).pathCount;
          return (
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs font-medium">
                {totalItems} total
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getValue()} markers
              </Badge>
            </div>
          );
        },
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Maps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search maps..."
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
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Visibility:</label>
                <Select
                  value={(table.getColumn('isPublic')?.getFilterValue() as string) ?? 'all'}
                  onValueChange={(value) => {
                    table.getColumn('isPublic')?.setFilterValue(value === 'all' ? undefined : value);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Maps</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Map Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Map Creation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mapStats?.creationTrends?.slice(-7) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Maps Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Markers', value: mapStats?.contentStats.totalMarkers || 0 },
                    { name: 'Collections', value: mapStats?.contentStats.totalCollections || 0 },
                    { name: 'Paths', value: mapStats?.contentStats.totalPaths || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Maps Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Maps ({table.getFilteredRowModel().rows.length} of {maps?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
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

// Analytics interfaces
interface UserStats {
  totalUsers: number;
  monthlyGrowthRate: number;
  registrationTrends: Array<{ date: string; count: number }>;
  weeklyTrends: Array<{ week: number; count: number }>;
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
}

interface GlobalStats {
  quality: {
    reviewQualityScore: number;
  };
  contentTrends: Array<{ date: string; places: number; reviews: number; photos: number }>;
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
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: trend.count,
    total: userStats.totalUsers,
  })) || [];

  const featureAdoptionData = [
    { name: 'Markers', value: activityMetrics?.featureUsage?.markerAdoption || 0 },
    { name: 'Collections', value: activityMetrics?.featureUsage?.collectionAdoption || 0 },
    { name: 'Paths', value: activityMetrics?.featureUsage?.pathAdoption || 0 },
    { name: 'Collaboration', value: activityMetrics?.featureUsage?.collaborationAdoption || 0 },
  ];

  const activityByHourData = activityMetrics?.creationByHour?.map((count: number, hour: number) => ({
    hour: hour.toString().padStart(2, '0') + ':00',
    activity: count,
  })) || [];

  const contentTrendsData = globalStats?.contentTrends?.slice(-10).map((trend) => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    places: trend.places,
    reviews: trend.reviews,
    photos: trend.photos,
  })) || [];

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
            <p className="text-xs text-muted-foreground">
              Active user rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityMetrics?.contentVelocity || 0}</div>
            <p className="text-xs text-muted-foreground">
              Items per day
            </p>
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
            <p className="text-xs text-muted-foreground">
              Monthly user growth
            </p>
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
            <CardTitle>Activity by Hour</CardTitle>
            <CardDescription>Platform activity throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityByHourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#ffc658"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Growth</CardTitle>
            <CardDescription>Places, reviews, and photos added over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={contentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="places"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Places"
                />
                <Area
                  type="monotone"
                  dataKey="reviews"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Reviews"
                />
                <Area
                  type="monotone"
                  dataKey="photos"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name="Photos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Content Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userStats?.weeklyTrends?.slice(0, 5).map((trend, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="text-sm font-medium">Week {trend.week}</div>
                  <Badge variant="secondary">{trend.count} users</Badge>
                </div>
              ))}
            </div>
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
      </div>
    </>
  );
}

export { MapsManagement, AnalyticsView };