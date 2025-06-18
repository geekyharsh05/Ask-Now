import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, signOut, User } from "./index";
import { useAuthStore } from "@/store/auth-store";

export function useSignIn() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "signIn"],
    mutationFn: signIn,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      
      queryClient.invalidateQueries();
      
      toast.success("Successfully signed in!");
      
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign in failed. Please try again.");
    },
  });
}

export function useSignUp() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "signUp"],
    mutationFn: signUp,
    onSuccess: (data) => {
      // Convert SignUpResponse to User format
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        createdAt: data.createdAt
      };
      
      // For signup, we don't get a token, so we'll set auth without token
      // The user will need to sign in after signup to get a token
      setAuth(user, undefined);
      
      queryClient.invalidateQueries();
      
      toast.success("Account created successfully! Please sign in to continue.");

      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign up failed. Please try again.");
    },
  });
}

export function useSignOut() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "signOut"],
    mutationFn: signOut,
    onSuccess: () => {
      clearAuth();
      
      queryClient.clear();
      
      toast.success("Successfully signed out!");

      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign out failed. Please try again.");
    },
  });
} 