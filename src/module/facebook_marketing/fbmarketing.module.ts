import { Module } from "@nestjs/common";
import { FacebookMarketingController } from "./fbmarketing.controller";
import { FacebookMarketingService } from "./fbmarketing.service";
import { HttpModule } from "@nestjs/axios";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [HttpModule],
    controllers: [FacebookMarketingController],
    providers: [FacebookMarketingService, JwtService]
})

export class FacebookMarketingModule { }