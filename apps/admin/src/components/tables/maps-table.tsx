"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@buzztrip/ui/components/button";
import { Badge } from "@buzztrip/ui/components/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@buzztrip/ui/components/table";

type MapWithStats = {
  _id: string;
  _creationTime: number;
  title: string;
  description?: string;
  visibility: "public" | "private" | "unlisted";
  ownerId: string;
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

  const columns: ColumnDef<MapWithStats>[] = [
    {
      accessorKey: "title",
      header: "Map",
      cell: ({ row }) => {
        const map = row.original;
        return (
          <div>
            <Link
              href={`/maps/${map._id}`}
              className="font-medium hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {map.title}
            </Link>
            {map.description && (
              <div className="text-sm text-muted-foreground line-clamp-1">
                {map.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const owner = row.getValue("owner") as MapWithStats["owner"];
        return owner ? (
          <Link
            href={`/users/${row.original.ownerId}`}
            className="text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {owner.name}
          </Link>
        ) : (
          <span className="text-muted-foreground text-sm">Unknown</span>
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
          <Badge variant={variant} className="capitalize">
            {visibility}
          </Badge>
        );
      },
    },
    {
      accessorKey: "_creationTime",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("_creationTime"));
        return (
          <span className="text-sm">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "markersCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Markers
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("markersCount")}
          </div>
        );
      },
    },
    {
      accessorKey: "collaboratorsCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Collaborators
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-center font-medium">
            {row.getValue("collaboratorsCount")}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/maps/${row.original._id}`)}
            >
              View Details
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No maps found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/maps/${row.original._id}`)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
