export interface CampaignDTO {
    id: string;
    name: string;
    adsets: AdSetDTO[];
}

export interface AdSetDTO {
    id: string;
    name: string;
    ads: AdDTO[];
}

export interface AdDTO {
    id: string;
    name: string;
    creative?: {
        id: string;
        body?: string;
    };
}