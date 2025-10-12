"use client";

import { Badge } from "@buzztrip/ui/components/badge";
import { Button } from "@buzztrip/ui/components/button";
import { Card, CardContent } from "@buzztrip/ui/components/card";
import { Input } from "@buzztrip/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@buzztrip/ui/components/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Globe,
  Lock,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type MapWithStats = {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  visibility: "public" | "private" | "unlisted";
  owner_id: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  } | null;
  markersCount: number;
  collaboratorsCount: number;
};

interface MapsListTableProps {
  maps: MapWithStats[];
  maxHeight?: string;
  showSearch?: boolean;
  emptyMessage?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  showActions?: boolean;
}

export function MapsListTable({
  maps,
  maxHeight = "500px",
  showSearch = true,
  emptyMessage = "No maps available",
  enableSorting = false,
  enablePagination = false,
  pageSize = 10,
  showActions = false,
}: MapsListTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public":
        return <Globe className="h-3 w-3" />;
      case "private":
        return <Lock className="h-3 w-3" />;
      case "unlisted":
        return <EyeOff className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getVisibilityVariant = (visibility: string) => {
    switch (visibility) {
      case "public":
        return "default";
      case "private":
        return "destructive";
      case "unlisted":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Simple filtering (used when TanStack is disabled)
  const filteredMaps = useMemo(() => {
    if (!searchQuery || enableSorting) return maps;

    return maps.filter(
      (map) =>
        map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        map.owner?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [maps, searchQuery, enableSorting]);

  // TanStack Table columns (used when sorting is enabled)
  const columns: ColumnDef<MapWithStats>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => {
          if (!enableSorting) return "Map";
          const isSorted = column.getIsSorted();
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className={`h-8 px-2 hover:bg-muted ${isSorted ? "bg-muted text-foreground" : ""}`}
            >
              Map
              {isSorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const map = row.original;
          return (
            <div className="py-2 max-w-md">
              <Link
                href={`/maps/${map._id}`}
                className="font-medium text-foreground hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {map.title}
              </Link>
              {map.description && (
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {map.description}
                </div>
              )}
            </div>
          );
        },
        enableSorting: enableSorting,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => {
          const owner = row.original.owner;
          return (
            <div className="py-2">
              {owner ? (
                <Link
                  href={`/users/${row.original.owner_id}`}
                  className="text-sm text-foreground hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {owner.name}
                </Link>
              ) : (
                <span className="text-muted-foreground text-sm">Unknown</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
          const visibility = row.original.visibility;
          return (
            <div className="py-2">
              <Badge
                variant={getVisibilityVariant(visibility)}
                className="capitalize gap-1"
              >
                {getVisibilityIcon(visibility)}
                {visibility}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "markersCount",
        header: ({ column }) => {
          if (!enableSorting) return <div className="text-center">Markers</div>;
          const isSorted = column.getIsSorted();
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className={`h-8 px-2 hover:bg-muted ${isSorted ? "bg-muted text-foreground" : ""}`}
              >
                Markers
                {isSorted === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : isSorted === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-center py-2">
            <span className="font-semibold text-lg text-foreground">
              {row.original.markersCount}
            </span>
          </div>
        ),
        enableSorting: enableSorting,
      },
      {
        accessorKey: "collaboratorsCount",
        header: ({ column }) => {
          if (!enableSorting)
            return <div className="text-center">Collaborators</div>;
          const isSorted = column.getIsSorted();
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className={`h-8 px-2 hover:bg-muted ${isSorted ? "bg-muted text-foreground" : ""}`}
              >
                Collaborators
                {isSorted === "asc" ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : isSorted === "desc" ? (
                  <ArrowDown className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-center py-2">
            <span className="font-semibold text-lg text-foreground">
              {row.original.collaboratorsCount}
            </span>
          </div>
        ),
        enableSorting: enableSorting,
      },
      {
        accessorKey: "_creationTime",
        header: ({ column }) => {
          if (!enableSorting) return "Created";
          const isSorted = column.getIsSorted();
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className={`h-8 px-2 hover:bg-muted ${isSorted ? "bg-muted text-foreground" : ""}`}
            >
              Created
              {isSorted === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : isSorted === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.original._creationTime);
          return (
            <div className="py-2">
              <span className="text-sm text-foreground">
                {date.toLocaleDateString("en-AU", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          );
        },
        enableSorting: enableSorting,
      },
      ...(showActions
        ? [
            {
              id: "actions",
              header: () => <div className="text-right pr-4">Actions</div>,
              cell: ({ row }: { row: any }) => {
                return (
                  <div className="text-right py-2 pr-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/maps/${row.original._id}`);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      View Details
                    </Button>
                  </div>
                );
              },
              enableSorting: false,
            },
          ]
        : []),
    ],
    [
      enableSorting,
      showActions,
      router,
      getVisibilityVariant,
      getVisibilityIcon,
    ]
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: enableSorting || enablePagination ? maps : filteredMaps,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getFilteredRowModel: enableSorting ? getFilteredRowModel() : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableSorting ? setColumnFilters : undefined,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableSorting ? columnFilters : undefined,
    },
    initialState: enablePagination
      ? {
          pagination: {
            pageSize,
          },
        }
      : undefined,
  });

  const displayMaps =
    enableSorting || enablePagination
      ? table.getRowModel().rows.map((row) => row.original)
      : filteredMaps;

  if (maps.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border border-border rounded-md">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {showSearch && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                enableSorting
                  ? "Filter by map title..."
                  : "Search maps by title, description, or owner..."
              }
              value={
                enableSorting
                  ? ((table.getColumn("title")?.getFilterValue() as string) ??
                    "")
                  : searchQuery
              }
              onChange={(e) => {
                if (enableSorting) {
                  table.getColumn("title")?.setFilterValue(e.target.value);
                } else {
                  setSearchQuery(e.target.value);
                }
              }}
              className="pl-9"
            />
          </div>
          {enableSorting && (
            <div className="text-sm text-muted-foreground">
              Showing {table.getFilteredRowModel().rows.length} map(s)
            </div>
          )}
        </div>
      )}

      {displayMaps.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            <div className="space-y-3 overflow-auto pr-1" style={{ maxHeight }}>
              {displayMaps.map((map) => (
                <Card
                  key={map._id}
                  className="bg-background border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => router.push(`/maps/${map._id}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Title and Description */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {map.title}
                      </h3>
                      {map.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {map.description}
                        </p>
                      )}
                    </div>

                    {/* Visibility Badge */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getVisibilityVariant(map.visibility)}
                        className="capitalize gap-1"
                      >
                        {getVisibilityIcon(map.visibility)}
                        {map.visibility}
                      </Badge>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Markers:
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {map.markersCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Collaborators:
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {map.collaboratorsCount}
                        </span>
                      </div>
                    </div>

                    {/* Owner and Date */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {map.owner ? (
                          <Link
                            href={`/users/${map.owner_id}`}
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {map.owner.name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(map._creationTime), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div
              className={`rounded-lg border border-border shadow-sm ${!enablePagination ? "overflow-auto" : "overflow-hidden"}`}
              style={!enablePagination ? { maxHeight } : undefined}
            >
              <Table>
                <TableHeader
                  className={
                    enablePagination
                      ? "bg-muted/50"
                      : "sticky top-0 bg-muted/95 backdrop-blur z-10"
                  }
                >
                  {enableSorting || enablePagination ? (
                    table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className={enablePagination ? "hover:bg-muted/50" : ""}
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="h-12 px-4">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableHead className="w-[30%]">Map</TableHead>
                      <TableHead className="w-[15%]">Owner</TableHead>
                      <TableHead className="w-[12%]">Visibility</TableHead>
                      <TableHead className="w-[10%] text-center">
                        Markers
                      </TableHead>
                      <TableHead className="w-[13%] text-center">
                        Collaborators
                      </TableHead>
                      <TableHead className="w-[20%]">Created</TableHead>
                    </TableRow>
                  )}
                </TableHeader>
                <TableBody>
                  {enableSorting || enablePagination ? (
                    table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() =>
                            router.push(`/maps/${row.original._id}`)
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-4">
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
                          No results found.
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    displayMaps.map((map) => (
                      <TableRow key={map._id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          <Link
                            href={`/maps/${map._id}`}
                            className="hover:underline"
                          >
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
                            <span className="text-muted-foreground text-sm">
                              Unknown
                            </span>
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
                            <span className="font-medium text-foreground">
                              {map.markersCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span className="font-medium text-foreground">
                              {map.collaboratorsCount}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                          {formatDistanceToNow(new Date(map._creationTime), {
                            addSuffix: true,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <div className="py-12 text-center text-muted-foreground border border-border rounded-md">
          {searchQuery ||
          (enableSorting && table.getColumn("title")?.getFilterValue()) ? (
            <div>
              <p className="font-medium">No maps found</p>
              <p className="text-sm mt-1">Try adjusting your search query</p>
            </div>
          ) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      )}

      {/* Results count for simple mode */}
      {!enableSorting && searchQuery && displayMaps.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {displayMaps.length} of {maps.length} map(s)
        </div>
      )}

      {/* Pagination */}
      {enablePagination && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
