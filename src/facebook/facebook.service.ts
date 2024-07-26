import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/service/prisma.service';

@Injectable()
export class FacebookService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(userData: { email: string; firstName: string; lastName: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userData.email,
          username: userData.firstName,
        },
      });
    }

    return user;
  }
}