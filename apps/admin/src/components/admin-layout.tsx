"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@buzztrip/components";
import { Badge } from "@buzztrip/components/ui";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", current: pathname === "/" },
    { name: "Users", href: "/users", current: pathname === "/users" },
    { name: "Maps", href: "/maps", current: pathname === "/maps" },
    { name: "Analytics", href: "/analytics", current: pathname === "/analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold">BuzzTrip Admin</h1>
                <Badge variant="secondary">Beta</Badge>
              </div>
              <nav className="flex space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
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

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center text-sm text-gray-500">
            BuzzTrip Admin Portal - {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}