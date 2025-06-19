"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import HeroSection from "@/components/landing/hero-section";

export default function Home() {
  const router = useRouter();

  // Get current session
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const result = await authClient.getSession();
      return result;
    },
  });

  const user = session?.data?.user as any;
  const isAuthenticated = !!session?.data?.session;

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their appropriate dashboard
      if (user.role === "CREATOR") {
        router.push("/dashboard");
      } else if (user.role === "RESPONDENT") {
        router.push("/respondent");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return (
      <main>
        <HeroSection />
      </main>
    );
  }

  // Show nothing while redirecting authenticated users
  return null;
}
