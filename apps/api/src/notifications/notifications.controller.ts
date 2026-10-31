import { Controller, Get, Query } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@Query("limit") limit?: string, @Query("status") status?: string) {
    return this.notificationsService.list(limit ? parseInt(limit, 10) : 50, status);
  }

  @Get("templates")
  async templates() {
    return this.notificationsService.templates();
  }
}
