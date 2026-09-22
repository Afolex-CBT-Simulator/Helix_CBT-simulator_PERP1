import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const passcode = String(body.passcode || "");
    const configuredPasscode = process.env.HELIX_ADMIN_PASSCODE || "";

    const response = NextResponse.json({
      success: passcode === configuredPasscode,
      diagnostics: {
        variableExists: Boolean(configuredPasscode),
        enteredLength: passcode.length,
        configuredLength: configuredPasscode.length,
        nodeEnvironment: process.env.NODE_ENV,
      },
    });

if (!response.ok) {
  const diagnostic = result.diagnostics
    ? ` Variable exists: ${result.diagnostics.variableExists}. Entered length: ${result.diagnostics.enteredLength}. Configured length: ${result.diagnostics.configuredLength}. Environment: ${result.diagnostics.nodeEnvironment}.`
    : "";

  throw new Error(`${result.error || "Login failed."}${diagnostic}`);
}
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
