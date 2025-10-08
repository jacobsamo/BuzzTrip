"use client";

import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components/ui";
import { UsersTable } from "@/components/tables/users-table";

export default function UsersPage() {
  const users = useQuery(api.admin.users.getAllUsersWithStats);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all BuzzTrip users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {!users ? (
            <div className="text-muted-foreground">Loading users...</div>
          ) : (
            <UsersTable data={users} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
