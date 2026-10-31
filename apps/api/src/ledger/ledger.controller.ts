import { Controller, Get, Headers, Res, UnauthorizedException } from "@nestjs/common";
import { LedgerService } from "./ledger.service";
import type { Response } from "express";

@Controller("ledger")
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get("trial-balance")
  async getTrialBalance(@Headers("x-tenant-id") tenantId?: string) {
    if (!tenantId) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    return this.ledgerService.getTrialBalance(tenantId);
  }

  @Get("export/sepidar")
  async exportSepidar(
    @Headers("x-tenant-id") tenantId: string,
    @Res() res: Response
  ) {
    if (!tenantId) {
      throw new UnauthorizedException("شناسه مستأجر (x-tenant-id) الزامی است");
    }
    const csv = await this.ledgerService.exportSepidarCsv(tenantId);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="sepidar-journal-export-${Date.now()}.csv"`
    );
    res.send(csv);
  }
}
