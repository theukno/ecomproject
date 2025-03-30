import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

// Paths that require authentication
const protectedPaths = ["/profile", "/orders", "/checkout"]

// Paths that are only accessible to non-authenticated users
const authPaths = ["/login", "/signup", "/verify"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const path = request.nextUrl.pathname

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(
    (protectedPath) => path === protectedPath || path.startsWith(`${protectedPath}/`),
  )

  // Check if path is for non-authenticated users only
  const isAuthPath = authPaths.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))

  // If no token and trying to access protected path
  if (!token && isProtectedPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname))
    return NextResponse.redirect(url)
  }

  // If has token and trying to access auth path
  if (token && isAuthPath) {
    try {
      // Verify token
      verify(token, process.env.JWT_SECRET || "fallback_secret")
      return NextResponse.redirect(new URL("/", request.url))
    } catch (error) {
      // Token is invalid, allow access to auth paths
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/verify/:path*",
  ],
}

