import { Roles } from "@/types/globals";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Define admin email addresses as fallback (same as middleware)
const adminEmails = ["jacob35422@gmail.com"];

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { userId } = await auth();
  if (!userId) return false;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user?.publicMetadata?.role === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
};

export const isAdmin = async (): Promise<boolean> => {
  return await checkRole("admin");
};

export const requireAdmin = async (): Promise<void> => {
  const hasAdminRole = await isAdmin();
  const isFallbackAdminCheck = await isFallbackAdmin();

  if (!hasAdminRole && !isFallbackAdminCheck) {
    throw new Error("Admin access required");
  }
};

// Helper to get user email for fallback authentication
export const getUserEmail = async (): Promise<string | null> => {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.emailAddresses[0]?.emailAddress || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

// Fallback admin check using email (for initial setup before roles are configured)
export const isFallbackAdmin = async (): Promise<boolean> => {
  const email = await getUserEmail();
  return email ? adminEmails.includes(email) : false;
};

// Combined admin check: first try role-based, then fallback to email
export const isAdminUser = async (): Promise<boolean> => {
  const hasAdminRole = await isAdmin();
  if (hasAdminRole) return true;

  // Fallback to email-based check for initial setup
  return await isFallbackAdmin();
};