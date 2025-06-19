import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = ["/signin", "/signup"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const publicRoutes = ["/", "/about", "/features"]; // Landing page routes
const surveyRoutes = (pathName: string) => pathName.startsWith("/survey/"); // Survey respondent routes
const appRoutes = (pathName: string) => pathName.startsWith("/dashboard") || pathName.startsWith("/surveys") || pathName.startsWith("/responses") || pathName.startsWith("/analytics"); // Creator dashboard routes

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isPublicRoute = publicRoutes.includes(pathName);
  const isSurveyRoute = surveyRoutes(pathName);
  const isAppRoute = appRoutes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute || isPublicRoute || isSurveyRoute || pathName.startsWith("/respondent")) {
      return NextResponse.next();
    }
    // Redirect to signin for protected routes
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Handle role-based redirects for authenticated users
  const userRole = (session.user as any)?.role;

  if (isAuthRoute || isPasswordRoute) {
    // Redirect authenticated users to their appropriate dashboard
    if (userRole === "CREATOR") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else if (userRole === "RESPONDENT") {
      return NextResponse.redirect(new URL("/respondent", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect app routes for creators only
  if (isAppRoute && userRole !== "CREATOR") {
    if (userRole === "RESPONDENT") {
      return NextResponse.redirect(new URL("/respondent", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect respondent routes for respondents only
  if (pathName.startsWith("/respondent") && userRole !== "RESPONDENT") {
    if (userRole === "CREATOR") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};