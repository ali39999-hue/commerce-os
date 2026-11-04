import { NextRequest, NextResponse } from "next/server";
import { logoutSessionInDb } from "../../../../lib/auth-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.replace(/^Bearer\s+/i, "").trim() || "";

    if (!token) {
      token = req.cookies.get("commerce_os_jwt")?.value || "";
    }

    if (token) {
      await logoutSessionInDb(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "خروج با موفقیت انجام شد.",
    });

    response.cookies.delete("commerce_os_jwt");
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "خطا در خروج";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
