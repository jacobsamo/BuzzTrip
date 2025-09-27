"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@buzztrip/components/ui";
import { getUsers, updateUserRole, toggleUserBan, deleteUser, searchUsers, getUserStatistics, type AdminUser } from "@/app/actions/user-management";
import { Roles } from "@/types/globals";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const pageSize = 10;

  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      const result = await getUsers(page, pageSize);
      setUsers(result.users);
      setTotalCount(result.totalCount);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
      setCurrentPage(page);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getUserStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers(1);
      return;
    }

    try {
      setLoading(true);
      const result = await searchUsers(searchQuery, pageSize);
      setUsers(result.users);
      setTotalCount(result.totalCount);
      setHasNextPage(false);
      setHasPreviousPage(false);
      setCurrentPage(1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to search users' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Roles) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Update the user in the local state
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        loadStatistics(); // Refresh stats
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user role' });
    }
  };

  const handleBanToggle = async (userId: string, currentBanned: boolean) => {
    try {
      const result = await toggleUserBan(userId, !currentBanned);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Update the user in the local state
        setUsers(users.map(user =>
          user.id === userId ? { ...user, banned: !currentBanned } : user
        ));
        loadStatistics(); // Refresh stats
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Remove the user from local state
        setUsers(users.filter(user => user.id !== userId));
        setTotalCount(totalCount - 1);
        loadStatistics(); // Refresh stats
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeVariant = (role: Roles | null) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.activeThisWeek}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.newThisMonth}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.adminUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Banned Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.bannedUsers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Alert */}
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              loadUsers(1);
            }}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={user.imageUrl}
                            alt={`${user.firstName || ''} ${user.lastName || ''}`}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{user.firstName} {user.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role || 'user'}
                          onValueChange={(value) => handleRoleChange(user.id, value as Roles)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.banned ? 'destructive' : 'secondary'}>
                          {user.banned ? 'Banned' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        {user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={user.banned ? "outline" : "destructive"}
                            onClick={() => handleBanToggle(user.id, user.banned)}
                          >
                            {user.banned ? 'Unban' : 'Ban'}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive">Delete</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete User</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete {user.firstName} {user.lastName}? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {users.length} of {totalCount} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => loadUsers(currentPage - 1)}
                    disabled={!hasPreviousPage}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => loadUsers(currentPage + 1)}
                    disabled={!hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}