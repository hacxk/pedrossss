import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { lastValueFrom, catchError, map } from 'rxjs';
import { CampaignDTO, AdSetDTO, AdDTO } from './dto/campaign.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookMarketingService {
    private readonly logger = new Logger(FacebookMarketingService.name);
    private readonly baseUrl: string;
    private readonly apiVersion: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.get<string>('FACEBOOK_API_BASE_URL', 'https://graph.facebook.com');
        this.apiVersion = this.configService.get<string>('FACEBOOK_API_VERSION', 'v17.0');
    }

    async getCampaignsByMessage(accessToken: string, messageText: string, userid): Promise<CampaignDTO[]> {
        console.log(userid)
        const url = `${this.baseUrl}/${this.apiVersion}/me/campaigns`;
        const params = {
            access_token: accessToken,
            fields: 'id,name,adsets{id,name,ads{id,name,creative{id,body}}}',
            limit: 1000,
        };

        try {
            const campaigns = await this.fetchAllPages<CampaignDTO>(url, params);
            return this.filterCampaignsByMessage(campaigns, messageText);
        } catch (error) {
            this.handleError(error);
        }
    }

    private async fetchAllPages<T>(url: string, params: any): Promise<T[]> {
        let allData: T[] = [];
        let nextPage = url;

        while (nextPage) {
            const response = await lastValueFrom(
                this.httpService.get<{ data: T[], paging?: { next?: string } }>(nextPage, { params }).pipe(
                    map(res => res.data),
                    catchError(error => {
                        this.logger.error(`Error fetching data from Facebook API: ${error.message}`);
                        throw error;
                    })
                )
            );

            allData = allData.concat(response.data);
            nextPage = response.paging?.next || null;
            params = {};
        }

        return allData;
    }

    private filterCampaignsByMessage(campaigns: CampaignDTO[], messageText: string): CampaignDTO[] {
        return campaigns.filter(campaign =>
            campaign.adsets.some(adset =>
                adset.ads.some(ad =>
                    ad.creative?.body?.toLowerCase().includes(messageText.toLowerCase())
                )
            )
        );
    }

    private handleError(error: any): never {
        if (error instanceof AxiosError) {
            const { response, request } = error;
            if (response) {
                const { status, data } = response;
                this.logger.error(`Facebook API Error: ${status} - ${JSON.stringify(data)}`);
                throw new HttpException(
                    `Facebook API Error: ${status} - ${JSON.stringify(data)}`,
                    HttpStatus.BAD_REQUEST
                );
            } else if (request) {
                this.logger.error('Facebook API Request Error: No response received');
                throw new HttpException(
                    'Facebook API Request Error: No response received',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        this.logger.error('Unexpected error fetching Facebook campaigns:', error);
        throw new HttpException(
            'Failed to fetch Facebook campaigns',
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}