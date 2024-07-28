
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FacebookMarketingService } from './fbmarketing.service';
import { CampaignDTO } from './dto/campaign.dto';
import { JwtAuthGuard } from 'src/helpers/guard/jwtauth.guard';

interface UserInfo extends Request {
    user: any;
}

@Controller('facebook-marketing')
export class FacebookMarketingController {
    constructor(private readonly facebookMarketingService: FacebookMarketingService) { }

    @Get('campaigns/by-message')
    @UseGuards(JwtAuthGuard)
    async getCampaignsByMessage(
        @Query('accessToken') accessToken: string,
        @Query('message') messageText: string,
        @Req() req: UserInfo
    ): Promise<CampaignDTO[]> {
        return this.facebookMarketingService.getCampaignsByMessage(accessToken, messageText, req.user);
    }
}
