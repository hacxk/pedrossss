// facebook-marketing.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { Observable, lastValueFrom } from 'rxjs';
import { CampaignDTO } from './dto/campaign.sto'; // Define DTOs for the API response

@Injectable()
export class FacebookMarketingService {
    constructor(private readonly httpService: HttpService) { }

    async getCampaignsByMessage(accessToken: string, messageText: string): Promise<CampaignDTO[]> {
        const url = `https://graph.facebook.com/v20.0/act_2987151564759317/campaigns`; // Update version as needed
        const params = {
            access_token: accessToken,
            fields: 'name,adsets{ads{creative{body}}}',
        };

        try {
            const response: AxiosResponse = await lastValueFrom(
                this.httpService.get(url, { params }),
            );

            const matchingCampaigns: CampaignDTO[] = [];
            for (const campaignData of response.data.data) {
                const campaign: CampaignDTO = {
                    id: campaignData.id,
                    name: campaignData.name,
                    adsets: campaignData.adsets.data.map((adsetData) => ({
                        ads: adsetData.ads.data.map((adData) => ({
                            creative: adData.creative,
                        })),
                    })),
                };

                if (campaign.adsets.some((adset) =>
                    adset.ads.some((ad) =>
                        ad.creative && ad.creative.body && ad.creative.body.includes(messageText)
                    )
                )) {
                    matchingCampaigns.push(campaign);
                }
            }

            return matchingCampaigns;
        } catch (error) {
            if (error instanceof AxiosError) { // Check if it's an Axios error
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    const { status, data } = axiosError.response;
                    // Log or throw a more specific error based on the response
                    throw new HttpException(
                        `Facebook API Error: ${status} - ${JSON.stringify(data)}`,
                        HttpStatus.BAD_REQUEST // Or the appropriate HTTP status code
                    );
                } else if (axiosError.request) {
                    throw new HttpException(
                        'Facebook API Request Error: No response received',
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }

            // For other errors, log and rethrow
            console.error('Unexpected error fetching Facebook campaigns:', error);
            throw new HttpException(
                'Failed to fetch Facebook campaigns',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
