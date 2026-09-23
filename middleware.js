import { NextResponse } from "next/server";
import { isValidAdminSession } from "./lib/admin-session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedAdminRoute = pathname.startsWith("/admin/dashboard");

  if (!isProtectedAdminRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get("helix_admin_session")?.value;

  if (!(await isValidAdminSession(session))) {
    const response = NextResponse.redirect(new URL("/admin", request.url));

    response.cookies.set("helix_admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
