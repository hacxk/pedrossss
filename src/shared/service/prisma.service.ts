import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private isConnected: boolean = false;

    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('PRISMA_DATABASE_URL'),
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.isConnected = true;
    }

    get isDatabaseConnected(): boolean {
        return this.isConnected;
    }
}
