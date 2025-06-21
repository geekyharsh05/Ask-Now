import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";
import { UserRole } from "@/types";

// Route configuration
const ROUTES = {
  // Authentication routes - accessible only when not authenticated
  auth: ["/signin", "/signup", "/check-email"],
  
  // Password reset routes - accessible when not authenticated
  password: ["/reset-password", "/forgot-password"],
  
  // Email verification routes
  verification: ["/email-verified"],
  
  // Public routes - accessible by everyone
  public: ["/", "/about", "/features"],
  
  // Creator-only routes (dashboard and management)
  creator: ["/dashboard", "/surveys", "/responses", "/analytics"],
  
  // Respondent-only routes
  respondent: ["/respondent"],
  
  // Survey response routes - accessible by anyone (public surveys)
  survey: ["/survey"],
  
  // API routes that need special handling
  api: {
    auth: ["/api/auth"],
    public: ["/api/surveys/public"],
    protected: ["/api/surveys", "/api/responses", "/api/questions"]
  }
} as const;

// Helper functions
function isRouteMatch(pathname: string, routes: readonly string[]): boolean {
  return routes.some(route => pathname === route || pathname.startsWith(route + "/"));
}

function getRouteType(pathname: string): string {
  if (isRouteMatch(pathname, ROUTES.auth)) return "auth";
  if (isRouteMatch(pathname, ROUTES.password)) return "password";
  if (isRouteMatch(pathname, ROUTES.verification)) return "verification";
  if (isRouteMatch(pathname, ROUTES.public)) return "public";
  if (isRouteMatch(pathname, ROUTES.creator)) return "creator";
  if (isRouteMatch(pathname, ROUTES.respondent)) return "respondent";
  if (isRouteMatch(pathname, ROUTES.survey)) return "survey";
  if (pathname.startsWith("/api/auth")) return "api-auth";
  if (isRouteMatch(pathname, ROUTES.api.public)) return "api-public";
  if (isRouteMatch(pathname, ROUTES.api.protected)) return "api-protected";
  return "unknown";
}

function createRedirectResponse(url: string, request: NextRequest, reason: string): NextResponse {
  console.log(`[Middleware] Redirecting to ${url} - Reason: ${reason}`);
  return NextResponse.redirect(new URL(url, request.url));
}

function createUnauthorizedResponse(message: string): NextResponse {
  console.log(`[Middleware] Unauthorized access: ${message}`);
  return NextResponse.json(
    { success: false, error: "Unauthorized", message },
    { status: 401 }
  );
}

async function getSession(request: NextRequest): Promise<Session | null> {
  try {
    const { data: session, error } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: process.env.BETTER_AUTH_URL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        // Add timeout to prevent hanging
        timeout: 10000,
      },
    );

    if (error) {
      console.log(`[Middleware] Session fetch error:`, error);
      return null;
    }

    return session;
  } catch (error) {
    console.error(`[Middleware] Session fetch failed:`, error);
    return null;
  }
}

function validateUserRole(role: any): role is UserRole {
  return role === UserRole.CREATOR || role === UserRole.RESPONDENT;
}

function getDefaultRedirectForRole(role: UserRole): string {
  switch (role) {
    case UserRole.CREATOR:
      return "/dashboard";
    case UserRole.RESPONDENT:
      return "/respondent";
    default:
      return "/";
  }
}

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";

  // Log request for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${method} ${pathname} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}`);
  }

  const routeType = getRouteType(pathname);

  // Always allow API auth routes and public API routes
  if (routeType === "api-auth" || routeType === "api-public") {
    return NextResponse.next();
  }

  // Get session for protected routes
  const session = await getSession(request);
  const isAuthenticated = !!session?.user;
  const userRole = session?.user ? (session.user as any)?.role : null;

  // Validate user role if authenticated
  if (isAuthenticated && !validateUserRole(userRole)) {
    console.error(`[Middleware] Invalid user role: ${userRole}`);
    if (pathname.startsWith("/api/")) {
      return createUnauthorizedResponse("Invalid user role");
    }
    return createRedirectResponse("/signin", request, "Invalid user role - forcing re-authentication");
  }

  // Check email verification for authenticated users (except on verification routes)
  if (isAuthenticated && routeType !== "verification" && !pathname.startsWith("/api/")) {
    const emailVerified = (session.user as any)?.emailVerified;
    if (emailVerified === false) {
      return createRedirectResponse("/check-email", request, "Email not verified");
    }
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    // Allow access to public routes, auth routes, password routes, and survey responses
    if (routeType === "public" || 
        routeType === "auth" || 
        routeType === "password" || 
        routeType === "survey" ||
        routeType === "verification") {
      return NextResponse.next();
    }

    // Handle API routes
    if (pathname.startsWith("/api/")) {
      return createUnauthorizedResponse("Authentication required");
    }

    // Redirect to signin for all other routes
    return createRedirectResponse("/signin", request, "Authentication required");
  }

  // Handle authenticated users
  
  // Redirect away from auth/password routes
  if (routeType === "auth" || routeType === "password") {
    const redirectUrl = getDefaultRedirectForRole(userRole);
    return createRedirectResponse(redirectUrl, request, "Already authenticated");
  }

  // Handle role-based access control
  switch (routeType) {
    case "creator":
      if (userRole !== UserRole.CREATOR) {
        if (pathname.startsWith("/api/")) {
          return createUnauthorizedResponse("Creator access required");
        }
        const redirectUrl = userRole === UserRole.RESPONDENT ? "/respondent" : "/";
        return createRedirectResponse(redirectUrl, request, "Creator access required");
      }
      break;

    case "respondent":
      if (userRole !== UserRole.RESPONDENT) {
        if (pathname.startsWith("/api/")) {
          return createUnauthorizedResponse("Respondent access required");
        }
        const redirectUrl = userRole === UserRole.CREATOR ? "/dashboard" : "/";
        return createRedirectResponse(redirectUrl, request, "Respondent access required");
      }
      break;

    case "api-protected":
      // Additional API protection can be added here
      if (!isAuthenticated) {
        return createUnauthorizedResponse("Authentication required for API access");
      }
      break;

    case "survey":
    case "public":
    case "verification":
      // These are accessible by authenticated users
      break;

    case "unknown":
      // Log unknown routes for debugging
      console.log(`[Middleware] Unknown route type for: ${pathname}`);
      break;
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Add user context to headers for API routes (optional)
  if (pathname.startsWith("/api/") && isAuthenticated) {
    response.headers.set("X-User-ID", session.user.id);
    response.headers.set("X-User-Role", userRole);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - static assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.css$|.*\\.js$|.*\\.map$).*)'],
};