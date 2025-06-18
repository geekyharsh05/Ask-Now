import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, signOut } from "./index";
import { useAuthStore } from "@/store/auth-store";
import { SignInSchema, SignUpSchema } from "@/validators/auth-schema";

// Sign In Mutation Hook
export function useSignIn() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Update Zustand store
      setAuth(data.user, data.token);
      
      // Clear any cached queries if needed
      queryClient.invalidateQueries();
      
      // Show success message
      toast.success("Successfully signed in!");
      
      // Get callback URL from search params or default to dashboard
      const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
      
      // Redirect to the intended page or dashboard
      router.push(callbackUrl);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign in failed. Please try again.");
    },
  });
}

// Sign Up Mutation Hook
export function useSignUp() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      // Update Zustand store
      setAuth(data.user, data.token);
      
      // Clear any cached queries if needed
      queryClient.invalidateQueries();
      
      // Show success message
      toast.success("Account created successfully! Welcome!");
      
      // Redirect to dashboard or home
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign up failed. Please try again.");
    },
  });
}

// Sign Out Mutation Hook
export function useSignOut() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Clear Zustand store
      clearAuth();
      
      // Clear all cached queries
      queryClient.clear();
      
      // Show success message
      toast.success("Successfully signed out!");
      
      // Redirect to sign in page
      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign out failed. Please try again.");
    },
  });
} 