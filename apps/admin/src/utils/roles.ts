import { Roles } from "@/types/globals";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.role === role;
};

export const isAdmin = async (): Promise<boolean> => {
  return await checkRole("admin");
};

export const requireAdmin = async (): Promise<void> => {
  const hasAdminRole = await isAdmin();
  if (!hasAdminRole) {
    throw new Error("Admin access required");
  }
};

// Helper to get user email for fallback authentication
export const getUserEmail = async (): Promise<string | null> => {
  const { sessionClaims } = await auth();
  return (sessionClaims?.email as string) || null;
};

// Fallback admin check using email (for initial setup before roles are configured)
export const isFallbackAdmin = async (): Promise<boolean> => {
  const email = await getUserEmail();
  const adminEmails = [
    "admin@buzztrip.co",
    // Add more admin emails as needed for initial setup
  ];
  return email ? adminEmails.includes(email) : false;
};

// Combined admin check: first try role-based, then fallback to email
export const isAdminUser = async (): Promise<boolean> => {
  const hasAdminRole = await isAdmin();
  if (hasAdminRole) return true;

  // Fallback to email-based check for initial setup
  return await isFallbackAdmin();
};