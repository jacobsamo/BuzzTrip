"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpDown, Map, MapPin, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "@buzztrip/backend/api"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "maps" | "markers" | "_creationTime">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const allUsers = useQuery(api.admin.users.getAllUsersWithStats)

  const filteredUsers = useMemo(() => {
    if (!allUsers) return []

    return allUsers
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "maps":
            comparison = a.mapsCount - b.mapsCount
            break
          case "markers":
            comparison = a.markersCount - b.markersCount
            break
          case "_creationTime":
            comparison = a._creationTime - b._creationTime
            break
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
  }, [allUsers, searchQuery, sortBy, sortOrder])

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

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
            <CardTitle className="text-card-foreground">All Users ({filteredUsers.length})</CardTitle>
            <CardDescription className="text-muted-foreground">
              Search and filter through registered users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-input text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("name")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Name
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("maps")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Maps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("_creationTime")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Joined
                </Button>
              </div>
            </div>

            {/* Users table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          {searchQuery ? "No users found matching your search" : "No users yet"}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-card-foreground">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                <Map className="h-3 w-3 mr-1" />
                                {user.mapsCount} maps
                              </Badge>
                              <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.markersCount} markers
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(user._creationTime), { addSuffix: true })}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Link href={`/users/${user._id}`}>
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
