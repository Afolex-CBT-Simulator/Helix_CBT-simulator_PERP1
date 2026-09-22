import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const passcode = String(body.passcode || "");

    if (!passcode || passcode !== process.env.HELIX_ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: "Incorrect passcode. Please try again." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("helix_admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login request could not be processed." },
      { status: 400 },
    );
  }
}
