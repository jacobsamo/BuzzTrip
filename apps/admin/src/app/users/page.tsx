"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"
import { UsersTable } from "@/components/tables/users-table"

export default function UsersPage() {
  const allUsers = useQuery(api.admin.users.getAllUsersWithStats)

  if (!allUsers) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage and view all registered users</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Users ({allUsers.length})</CardTitle>
            <CardDescription className="text-muted-foreground">
              Search, filter, and manage registered users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable data={allUsers} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
