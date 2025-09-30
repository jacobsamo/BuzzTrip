import { Card, CardContent, CardHeader } from "@buzztrip/components";

// Basic skeleton component
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="pl-2">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Engagement Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-1" />
              <Skeleton className="h-3 w-24 mb-4" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Users page skeleton
export function UsersPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex gap-4 pb-2 border-b">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Maps page skeleton
export function MapsPageSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maps Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex gap-4 pb-2 border-b">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 py-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// User detail page skeleton
export function UserDetailSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-64 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Tab Content */}
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}