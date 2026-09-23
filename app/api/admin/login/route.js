import { NextResponse } from "next/server";
import { createAdminSession } from "../../../../lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { passcode } = await request.json();

    const enteredPasscode = String(passcode || "");
    const configuredPasscode = process.env.HELIX_ADMIN_PASSCODE;

    if (
      !configuredPasscode ||
      !enteredPasscode ||
      enteredPasscode !== configuredPasscode
    ) {
      return NextResponse.json(
        { error: "Incorrect passcode. Please try again." },
        { status: 401 },
      );
    }

    const session = await createAdminSession();

    const response = NextResponse.json({ success: true });

    response.cookies.set("helix_admin_session", session, {
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
