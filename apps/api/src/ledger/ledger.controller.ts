import { Controller, Get, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import { CurrentTenant } from "../common/guards/current-tenant.decorator";
import { LedgerService } from "./ledger.service";
import type { Response } from "express";

@Controller("ledger")
@UseGuards(AdminGuard)
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get("trial-balance")
  async getTrialBalance(@CurrentTenant() tenantId: string) {
    return this.ledgerService.getTrialBalance(tenantId);
  }

  @Get("export/sepidar")
  async exportSepidar(@CurrentTenant() tenantId: string, @Res() res: Response) {
    const csv = await this.ledgerService.exportSepidarCsv(tenantId);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="sepidar-journal-export-${Date.now()}.csv"`
    );
    res.send(csv);
  }
}
