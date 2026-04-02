import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const adminSession = request.cookies.get("admin_session")

  // always allow admin login page
  if (path === "/admin/login") {
    return NextResponse.next()
  }

  // protect admin routes
  if (path.startsWith("/admin") && !adminSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
