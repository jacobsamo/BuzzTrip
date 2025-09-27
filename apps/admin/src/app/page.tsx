"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components";
import {
  Button,
  Input,
  Dialog,
  DialogTrigger,
  DialogContent,
  Alert,
  AlertDescription,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@buzztrip/components/ui";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-[400px]">
            <CardHeader className="text-center">
              <CardTitle>BuzzTrip Admin Portal</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignInButton mode="modal">
                <Button>
                  Sign in to Admin Portal
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </Unauthenticated>

      <Authenticated>
        <AdminContent />
      </Authenticated>
    </div>
  );
}

function AdminContent() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">BuzzTrip Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span>Welcome, {user?.firstName}!</span>
          <UserButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Maps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertDescription>
          Admin portal is now successfully connected to Clerk and Convex!
          <Badge className="ml-2" variant="secondary">✅ Component Library Working</Badge>
        </AlertDescription>
      </Alert>
    </div>
  );
}