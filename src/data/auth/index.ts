import axios, { AxiosError } from "axios";
import { SignInSchema, SignUpSchema } from "@/validators/auth-schema";

// Create axios instance with base configuration
const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token if available
authApi.interceptors.request.use((config) => {
  // Get token from cookies (for SSR compatibility)
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.data) {
      throw new Error((error.response.data as ErrorResponse).message || "Request failed");
    }
    throw new Error(error.message || "Network error");
  }
);

// Types for API responses
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "RESPONDENT" | "CREATOR";
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

// Sign Up API function
export async function signUp(data: SignUpSchema): Promise<AuthResponse> {
  const response = await authApi.post<AuthResponse>("/register", data);
  return response.data;
}

// Sign In API function
export async function signIn(data: SignInSchema): Promise<AuthResponse> {
  const response = await authApi.post("/login", data);
  return response.data;
}

// Logout API function
export async function signOut(): Promise<void> {
  await authApi.post("/logout");
}

export { authApi };
