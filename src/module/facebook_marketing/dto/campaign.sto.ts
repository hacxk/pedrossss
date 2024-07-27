// AdCreativeDTO.ts
export class AdCreativeDTO {
    body: string;
    // Add more fields as needed
}

// AdDTO.ts
export class AdDTO {
    creative: AdCreativeDTO;
}

// AdSetDTO.ts
export class AdSetDTO {
    ads: AdDTO[];
}

// CampaignDTO.ts
export class CampaignDTO {
    id: string; // Assuming you might want the campaign ID as well
    name: string;
    adsets: AdSetDTO[];
}
