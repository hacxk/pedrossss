// facebook-marketing.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { FacebookMarketingService } from './fbmarketing.service';
import { CampaignDTO } from './dto/campaign.sto'; // Import your DTOs
import { JwtAuthGuard } from 'src/helpers/guard/jwtauth.guard';

@Controller('facebook-marketing')
export class FacebookMarketingController {
    constructor(private readonly facebookMarketingService: FacebookMarketingService) { }

    @Get('campaigns/by-message')
    @UseGuards(JwtAuthGuard)
    async getCampaignsByMessage(
        @Query('accessToken') accessToken: string,
        @Query('message') messageText: string
    ): Promise<CampaignDTO[]> {
        return this.facebookMarketingService.getCampaignsByMessage(accessToken, messageText);
    }
}
