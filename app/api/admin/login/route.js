import { NextResponse } from "next/server";
import { createAdminSession } from "../../../../lib/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminPasscode() {
  const value = process.env.HELIX_ADMIN_PASSCODE;

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function POST(request) {
  try {
    const adminPasscode = getAdminPasscode();

    if (!adminPasscode) {
      return NextResponse.json(
        {
          error:
            "Admin passcode is not configured for this deployment. Check HELIX_ADMIN_PASSCODE in Vercel Production.",
        },
        { status: 500 },
      );
    }

    const { passcode } = await request.json();
    const enteredPasscode = String(passcode || "").trim();

    if (enteredPasscode !== adminPasscode) {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Login request could not be processed." },
      { status: 400 },
    );
  }
}
