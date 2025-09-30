"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@buzztrip/components/ui";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Simplified navigation - main content now uses tabs
  const isOnMainDashboard = pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold">BuzzTrip Admin</h1>
                <Badge variant="secondary">Beta</Badge>
              </div>
              {!isOnMainDashboard && (
                <nav className="flex space-x-6">
                  <Link
                    href="/"
                    className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    ← Back to Dashboard
                  </Link>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}