import { Module } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";
import { RecommendationsController } from "./recommendations.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
