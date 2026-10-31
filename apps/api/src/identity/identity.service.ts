import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { validateIranianMobile, normalizePersianText } from "@commerce-os/localization";
import { timingSafeEqualStrings } from "@commerce-os/security";
import * as crypto from "node:crypto";

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  private hashOtp(code: string, salt: string): string {
    return crypto.createHash("sha256").update(`${code}:${salt}`).digest("hex");
  }

  async requestOtp(phone: string): Promise<{ phone: string; expiresInSeconds: number; simulatedCode?: string }> {
    const cleanPhone = normalizePersianText(phone).replace(/\D/g, "");
    if (!validateIranianMobile(cleanPhone)) {
      throw new BadRequestException("شماره موبایل وارد شده معتبر نیست (فرمت صحیح: ۰۹xxxxxxxxx)");
    }

    // In local development or testing, use deterministic or random 5-digit code
    const rawCode = process.env.NODE_ENV === "production"
      ? crypto.randomInt(10000, 99999).toString()
      : "12345";

    const salt = crypto.randomBytes(16).toString("hex");
    const codeHash = this.hashOtp(rawCode, salt);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.otpChallenge.create({
      data: {
        phone: cleanPhone,
        codeHash,
        salt,
        expiresAt,
      },
    });

    return {
      phone: cleanPhone,
      expiresInSeconds: 300,
      simulatedCode: process.env.NODE_ENV !== "production" ? rawCode : undefined,
    };
  }

  async verifyOtp(phone: string, code: string): Promise<{ token: string; user: any }> {
    const cleanPhone = normalizePersianText(phone).replace(/\D/g, "");
    const cleanCode = normalizePersianText(code).replace(/\D/g, "");

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        phone: cleanPhone,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!challenge) {
      throw new UnauthorizedException("کد تایید منقضی شده یا درخواستی یافت نشد");
    }

    if (challenge.attempts >= 5) {
      throw new UnauthorizedException("تعداد دفعات تلاش بیش از حد مجاز است. لطفاً مجدداً کد دریافت کنید.");
    }

    const expectedHash = this.hashOtp(cleanCode, challenge.salt);
    const isValid = timingSafeEqualStrings(challenge.codeHash, expectedHash);

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: {
        attempts: { increment: 1 },
        isUsed: isValid,
      },
    });

    if (!isValid) {
      throw new UnauthorizedException("کد تایید وارد شده نادرست است");
    }

    // Find or create customer
    let user = await this.prisma.user.findUnique({
      where: { phone: cleanPhone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: cleanPhone,
          role: "CUSTOMER",
          fullName: "کاربر فروشگاه",
        },
      });
    }

    // Generate Session Token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        userAgent: "API Client",
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000), // 30 days
      },
    });

    return {
      token: sessionToken,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateSessionToken(token: string) {
    if (!token) return null;
    const session = await this.prisma.userSession.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  }
}
