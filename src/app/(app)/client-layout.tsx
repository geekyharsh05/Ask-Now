"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Get current session and user data
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result;
    },
  });

  const user = session?.data?.user as any; // Better auth user with additional fields
  const isAuthenticated = !!session?.data?.session;

  useEffect(() => {
    if (!isLoading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        router.push("/signin");
        return;
      }

      // Redirect if user is not a creator
      if (user?.role !== "CREATOR") {
        router.push("/"); // Redirect to landing page
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="dark min-h-screen bg-background">
        <div className="flex">
          <div className="w-64 p-4 space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </div>
          <div className="flex-1 p-8 space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated || user?.role !== "CREATOR") {
    return null;
  }

  return (
    <div className="dark min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
          <main className="flex-1 p-1">{children}</main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
