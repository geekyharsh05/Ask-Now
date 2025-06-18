"use client";

import { useAuthStore, useUser, useIsAuthenticated } from "@/store/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/data/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      clearAuth();
      router.push("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
                  <p className="text-lg font-semibold text-white">
                    {user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Username
                  </label>
                  <p className="text-lg font-semibold text-white">
                    {user?.username || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg font-semibold text-white">
                    {user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg font-semibold text-white">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.role === "CREATOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user?.role || "N/A"}
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

        {/* Raw User Data Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Raw User Data</CardTitle>
            <CardDescription>
              Complete user object from the auth store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(user, null, 2)}
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
                  Token Present
                </label>
                <p className="text-lg">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      useAuthStore.getState().token
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {useAuthStore.getState().token ? "Yes" : "No"}
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
                disabled={isLoggingOut}
                className="sm:w-auto"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
