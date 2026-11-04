import { NextRequest, NextResponse } from "next/server";
import { validateSessionInDb } from "../../../../lib/auth-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Bearer Authorization header
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.replace(/^Bearer\s+/i, "").trim() || "";

    // 2. Fallback to cookie
    if (!token) {
      token = req.cookies.get("commerce_os_jwt")?.value || "";
    }

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: "توکن احراز هویت یافت نشد." },
        { status: 401 }
      );
    }

    const user = await validateSessionInDb(token);

    if (!user) {
      const response = NextResponse.json(
        { authenticated: false, error: "نشست نامعتبر است یا منقضی شده است." },
        { status: 401 }
      );
      // Clear invalid cookie
      response.cookies.delete("commerce_os_jwt");
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "خطای احراز هویت";
    return NextResponse.json({ authenticated: false, error: message }, { status: 500 });
  }
}
