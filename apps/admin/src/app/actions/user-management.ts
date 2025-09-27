"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/utils/roles";
import { Roles } from "@/types/globals";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
  role: Roles | null;
  banned: boolean;
}

/**
 * Get a paginated list of users for admin management
 */
export async function getUsers(page: number = 1, limit: number = 10) {
  await requireAdmin();

  try {
    const client = await clerkClient();
    const offset = (page - 1) * limit;

    const response = await client.users.getUserList({
      limit,
      offset,
      orderBy: "-created_at",
    });

    const users: AdminUser[] = response.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      role: (user.publicMetadata?.role as Roles) || null,
      banned: user.banned,
    }));

    return {
      users,
      totalCount: response.totalCount,
      hasNextPage: offset + limit < response.totalCount,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Update a user's role
 */
export async function updateUserRole(userId: string, role: Roles) {
  await requireAdmin();

  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    console.log(`Role updated for user ${userId}: ${role}`);
    return { success: true, message: `User role updated to ${role}` };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: "Failed to update user role" };
  }
}

/**
 * Ban or unban a user
 */
export async function toggleUserBan(userId: string, banned: boolean) {
  await requireAdmin();

  try {
    const client = await clerkClient();

    if (banned) {
      await client.users.banUser(userId);
    } else {
      await client.users.unbanUser(userId);
    }

    console.log(`User ${userId} ${banned ? 'banned' : 'unbanned'}`);
    return {
      success: true,
      message: `User ${banned ? 'banned' : 'unbanned'} successfully`
    };
  } catch (error) {
    console.error(`Error ${banned ? 'banning' : 'unbanning'} user:`, error);
    return {
      success: false,
      message: `Failed to ${banned ? 'ban' : 'unban'} user`
    };
  }
}

/**
 * Delete a user (permanent action)
 */
export async function deleteUser(userId: string) {
  await requireAdmin();

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);

    console.log(`User ${userId} deleted`);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Failed to delete user" };
  }
}

/**
 * Search users by email or name
 */
export async function searchUsers(query: string, limit: number = 10) {
  await requireAdmin();

  if (!query.trim()) {
    return { users: [], totalCount: 0 };
  }

  try {
    const client = await clerkClient();

    // Search by email first
    const emailResults = await client.users.getUserList({
      emailAddress: [query],
      limit,
    });

    // If no email matches, search by name
    let nameResults: { data: never[]; totalCount: number } = { data: [], totalCount: 0 };
    if (emailResults.data.length === 0) {
      nameResults = await client.users.getUserList({
        query: query,
        limit,
      });
    }

    const users: AdminUser[] = [...emailResults.data, ...nameResults.data].map((user) => ({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
      role: (user.publicMetadata?.role as Roles) || null,
      banned: user.banned,
    }));

    return {
      users,
      totalCount: emailResults.totalCount + nameResults.totalCount,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Failed to search users");
  }
}

/**
 * Get user statistics
 */
export async function getUserStatistics() {
  await requireAdmin();

  try {
    const client = await clerkClient();

    // Get total users
    const allUsers = await client.users.getUserList({ limit: 500 }); // Adjust limit as needed

    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const stats = {
      totalUsers: allUsers.totalCount,
      activeThisWeek: allUsers.data.filter(user =>
        user.lastSignInAt && user.lastSignInAt > oneWeekAgo
      ).length,
      newThisMonth: allUsers.data.filter(user =>
        user.createdAt > oneMonthAgo
      ).length,
      adminUsers: allUsers.data.filter(user =>
        user.publicMetadata?.role === 'admin'
      ).length,
      bannedUsers: allUsers.data.filter(user => user.banned).length,
    };

    return stats;
  } catch (error) {
    console.error("Error getting user statistics:", error);
    throw new Error("Failed to get user statistics");
  }
}