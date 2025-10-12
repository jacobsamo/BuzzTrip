"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@buzztrip/ui/components/input"
import { Badge } from "@buzztrip/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@buzztrip/ui/components/table"
import { Search, MapPin, Users, Globe, Lock, EyeOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type MapWithStats = {
  _id: string
  _creationTime: number
  title: string
  description?: string
  visibility: "public" | "private" | "unlisted"
  owner_id: string
  owner: {
    _id: string
    name: string
    email: string
  } | null
  markersCount: number
  collaboratorsCount: number
}

interface MapsListTableProps {
  maps: MapWithStats[]
  maxHeight?: string
}

export function MapsListTable({ maps, maxHeight = "500px" }: MapsListTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

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

  const getVisibilityVariant = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "default"
      case "private":
        return "destructive"
      case "unlisted":
        return "secondary"
      default:
        return "outline"
    }
  }

  const filteredMaps = useMemo(() => {
    if (!searchQuery) return maps

    return maps.filter(
      (map) =>
        map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.owner?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [maps, searchQuery])

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search maps by title, description, or owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Maps Table */}
      {filteredMaps.length > 0 ? (
        <div
          className="rounded-md border border-border overflow-auto"
          style={{ maxHeight }}
        >
          <Table>
            <TableHeader className="sticky top-0 bg-muted/95 backdrop-blur z-10">
              <TableRow>
                <TableHead className="w-[30%]">Map</TableHead>
                <TableHead className="w-[15%]">Owner</TableHead>
                <TableHead className="w-[12%]">Visibility</TableHead>
                <TableHead className="w-[10%] text-center">Markers</TableHead>
                <TableHead className="w-[13%] text-center">Collaborators</TableHead>
                <TableHead className="w-[20%]">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaps.map((map) => (
                <TableRow key={map._id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <Link href={`/maps/${map._id}`} className="hover:underline">
                      <div className="space-y-1">
                        <div className="text-foreground">{map.title}</div>
                        {map.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {map.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {map.owner ? (
                      <Link
                        href={`/users/${map.owner_id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        {map.owner.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-sm">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getVisibilityVariant(map.visibility)}
                      className="capitalize gap-1"
                    >
                      {getVisibilityIcon(map.visibility)}
                      {map.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="font-medium text-foreground">{map.markersCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="font-medium text-foreground">{map.collaboratorsCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatDistanceToNow(new Date(map._creationTime), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground border border-border rounded-md">
          {searchQuery ? (
            <div>
              <p className="font-medium">No maps found</p>
              <p className="text-sm mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <p>No maps available</p>
          )}
        </div>
      )}

      {/* Results count */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredMaps.length} of {maps.length} map(s)
        </div>
      )}
    </div>
  )
}
