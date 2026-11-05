import { NextRequest, NextResponse } from "next/server";
import { loginUserInDb } from "../../../../lib/auth-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || typeof username !== "string" || !username.trim()) {
      return NextResponse.json(
        { error: "لطفاً نام کاربری را وارد نمایید." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "لطفاً رمز عبور را وارد نمایید." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { user, token } = await loginUserInDb({
      username: username.trim(),
      password,
      userAgent,
      ipAddress,
    });

    const response = NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد.",
      user,
      token,
    });

    // Set HTTP-only Cookie
    response.cookies.set("commerce_os_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 3600, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "نام کاربری یا رمز عبور اشتباه است.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
