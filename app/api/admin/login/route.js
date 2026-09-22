import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { passcode } = await request.json();

    if (String(passcode || "") !== "Helix Simulator") {
      return NextResponse.json(
        { error: "Incorrect passcode. Please try again." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("helix_admin_session", "authenticated", {
      httpOnly: true,
      secure: true,
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
