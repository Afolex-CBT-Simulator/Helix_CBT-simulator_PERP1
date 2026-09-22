import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const passcode = String(body.passcode || "");
    const configuredPasscode = process.env.HELIX_ADMIN_PASSCODE || "";

    if (passcode !== configuredPasscode) {
      return NextResponse.json(
        {
          error: "Incorrect passcode.",
          diagnostics: {
            variableExists: Boolean(configuredPasscode),
            enteredLength: passcode.length,
            configuredLength: configuredPasscode.length,
            nodeEnvironment: process.env.NODE_ENV,
          },
        },
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
