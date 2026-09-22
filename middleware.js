import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("helix_admin_session")?.value;

  const isAdminDashboard = pathname.startsWith("/admin/dashboard");

  if (isAdminDashboard && session !== "authenticated") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
