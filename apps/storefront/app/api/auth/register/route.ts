import { NextRequest, NextResponse } from "next/server";
import { registerUserInDb } from "../../../../lib/auth-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, fullName, contact } = body;

    if (!username || typeof username !== "string" || username.trim().length < 3) {
      return NextResponse.json(
        { error: "نام کاربری باید حداقل ۳ کاراکتر باشد." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "رمز عبور باید حداقل ۶ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const { user, token } = await registerUserInDb({
      username: username.trim(),
      password,
      fullName: typeof fullName === "string" ? fullName.trim() : undefined,
      contact: typeof contact === "string" ? contact.trim() : undefined,
      userAgent,
      ipAddress,
    });

    const response = NextResponse.json({
      success: true,
      message: "حساب کاربری با موفقیت ایجاد شد.",
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
    const message = err instanceof Error ? err.message : "خطایی در ثبت‌نام رخ داد.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
