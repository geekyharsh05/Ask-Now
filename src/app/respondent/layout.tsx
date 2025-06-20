"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut, ChevronDown, Home } from "lucide-react";
import type { User as UserType } from "@/types";

export default function RespondentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Get current session and user data
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result;
    },
  });

  const user = session?.data?.user as UserType | undefined;
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
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="dark min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/respondent" className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">Survey Hub</span>
            </Link>
          </div>

          {/* User Avatar or Login Button */}
          <div className="flex items-center space-x-4">
            {sessionLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              </div>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 h-10 rounded-lg px-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? undefined}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex sm:flex-col sm:items-start sm:text-left">
                      <span className="text-sm font-medium">{user.name}</span>
                      <Badge
                        variant={
                          user.role === "CREATOR" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-8">{children}</main>
    </div>
  );
}
