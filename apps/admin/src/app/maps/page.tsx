"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { generateMockMaps } from "@/lib/mock-data"
import { Search, ArrowUpDown, MapPin, FolderOpen, ChevronRight, Globe, Lock, EyeOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function MapsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "markers" | "updated">("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const maps = generateMockMaps(100)

  const filteredMaps = maps
    .filter(
      (map) =>
        map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "markers":
          comparison = a.markersCount - b.markersCount
          break
        case "updated":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-3 w-3" />
      case "private":
        return <Lock className="h-3 w-3" />
      case "unlisted":
        return <EyeOff className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Maps</h1>
          <p className="text-muted-foreground mt-1">Browse and manage all maps</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">All Maps ({filteredMaps.length})</CardTitle>
            <CardDescription className="text-muted-foreground">
              Search and filter through all created maps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-input text-foreground"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("title")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Title
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("markers")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Markers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort("updated")}
                  className="bg-background border-input text-foreground"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Updated
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredMaps.map((map) => (
                <Link key={map.id} href={`/maps/${map.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-secondary-foreground">{map.title}</h3>
                        <Badge variant="outline" className="text-xs border-border text-muted-foreground bg-background">
                          {getVisibilityIcon(map.visibility)}
                          <span className="ml-1">{map.visibility}</span>
                        </Badge>
                      </div>
                      {map.description && <p className="text-sm text-muted-foreground mt-1">{map.description}</p>}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Owner: {map.ownerName}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {map.markersCount} markers
                        </span>
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {map.collectionsCount} collections
                        </span>
                        <span>Updated {formatDistanceToNow(new Date(map.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
