import { Controller, Post, Get, Body, Headers, UnauthorizedException } from "@nestjs/common";
import { IdentityService } from "./identity.service";

@Controller("auth")
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post("otp/request")
  async requestOtp(@Body() body: { phone: string }) {
    return this.identityService.requestOtp(body.phone);
  }

  @Post("otp/verify")
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    return this.identityService.verifyOtp(body.phone, body.code);
  }

  @Get("me")
  async getMe(@Headers("authorization") authHeader?: string) {
    const token = authHeader?.replace(/^Bearer\s+/i, "");
    if (!token) {
      throw new UnauthorizedException("توکن احراز هویت الزامی است");
    }
    const user = await this.identityService.validateSessionToken(token);
    if (!user) {
      throw new UnauthorizedException("نشست کاربری نامعتبر یا منقضی شده است");
    }
    return {
      id: user.id,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
