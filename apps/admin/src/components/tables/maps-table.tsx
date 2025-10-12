"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Globe, Lock, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@buzztrip/ui/components/button";
import { Badge } from "@buzztrip/ui/components/badge";
import { Input } from "@buzztrip/ui/components/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@buzztrip/ui/components/table";

type MapWithStats = {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  visibility: "public" | "private" | "unlisted";
  owner_id: string;
  owner: {
    name: string;
    email: string;
  } | null;
  markersCount: number;
  collaboratorsCount: number;
  location?: string;
  updatedAt?: string;
};

export function MapsTable({ data }: { data: MapWithStats[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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

  const columns: ColumnDef<MapWithStats>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue("owner") as MapWithStats["owner"];
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
        const visibility = row.getValue("visibility") as string;
        const variant =
          visibility === "public"
            ? "default"
            : visibility === "private"
            ? "destructive"
            : "secondary";

        return (
          <div className="py-2">
            <Badge variant={variant} className="capitalize gap-1">
              {getVisibilityIcon(visibility)}
              {visibility}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "_creationTime",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
        const date = new Date(row.getValue("_creationTime"));
        return (
          <div className="py-2">
            <span className="text-sm text-foreground">
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "markersCount",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      cell: ({ row }) => {
        return (
          <div className="text-center py-2">
            <span className="font-semibold text-lg text-foreground">
              {row.getValue("markersCount")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "collaboratorsCount",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      cell: ({ row }) => {
        return (
          <div className="text-center py-2">
            <span className="font-semibold text-lg text-foreground">
              {row.getValue("collaboratorsCount")}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-4">Actions</div>,
      cell: ({ row }) => {
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
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No maps found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by map title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} map(s)
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-muted/50">
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
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => router.push(`/maps/${row.original._id}`)}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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
    </div>
  );
}
