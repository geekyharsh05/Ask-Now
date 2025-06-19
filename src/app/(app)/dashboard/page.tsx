"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Get current session and user data using better-auth
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result;
    },
  });

  const user = session?.data?.user;
  const isAuthenticated = !!session?.data?.session;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await authClient.signOut();
      return result;
    },
    onSuccess: () => {
      router.push("/signin");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  // Redirect to signin if not authenticated
  if (!sessionLoading && !isAuthenticated) {
    router.push("/signin");
    return null;
  }

  // Show loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's your account information.
          </p>
        </div>

        {/* User Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Your account details and profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg font-semibold">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (user as any)?.role === "CREATOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {(user as any)?.role || "N/A"}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email Verified
                  </label>
                  <p className="text-lg">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.emailVerified ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="text-sm font-mono text-gray-700 bg-gray-100 p-2 rounded">
                    {user?.id || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raw Session Data Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Raw Session Data</CardTitle>
            <CardDescription>
              Complete session object from better-auth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(session?.data, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Auth Store State Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
            <CardDescription>Current state of the auth store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Is Authenticated
                </label>
                <p className="text-lg">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAuthenticated
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isAuthenticated ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Session Active
                </label>
                <p className="text-lg">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session?.data?.session
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {session?.data?.session ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Account management options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="sm:w-auto"
              >
                Refresh Page
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="sm:w-auto"
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
