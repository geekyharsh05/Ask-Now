import axios, { AxiosError } from "axios";
import { SignInSchema, SignUpSchema } from "@/validators/auth-schema";

const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});


// Response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 409) {
      // Handle conflict errors (e.g., email/username already exists)
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || "Email or username already exists");
    }
    
    if (error.response?.status === 400) {
      // Handle validation errors
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || "Invalid input data");
    }
    
    if (error.response?.status === 401) {
      // Handle authentication errors
      const errorData = error.response.data as ErrorResponse;
      throw new Error(errorData.message || "Invalid credentials");
    }
    
    if (error.response?.status === 500) {
      // Handle server errors
      throw new Error("Server error. Please try again later.");
    }
    
    if (error.response?.data) {
      throw new Error((error.response.data as ErrorResponse).message || "Request failed");
    }
    
    throw new Error(error.message || "Network error");
  }
);

// Types for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  role: "RESPONDENT" | "CREATOR";
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface SignUpResponse {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  role: "RESPONDENT" | "CREATOR";
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

// Sign Up API function
export async function signUp(data: SignUpSchema): Promise<SignUpResponse> {
  const response = await authApi.post<SignUpResponse>("/register", data);
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
