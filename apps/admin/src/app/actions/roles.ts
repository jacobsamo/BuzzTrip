"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/utils/roles";
import { Roles } from "@/types/globals";

export async function setUserRole(userId: string, role: Roles) {
  // Ensure the current user is an admin
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

export async function getUserRole(userId: string): Promise<Roles | null> {
  await requireAdmin();

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return (user.publicMetadata?.role as Roles) || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export async function getCurrentUserInfo() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  return {
    userId,
    email: sessionClaims?.email,
    role: sessionClaims?.metadata?.role || null,
  };
}