import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, UserFBInfo } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserFBInfoDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { fbInfo, ...userData } = createUserDto;
    return this.prisma.user.create({
      data: {
        ...userData,
        fbInfo: fbInfo
          ? {
              create: {
                accessToken: fbInfo.accessToken,
                fbId: fbInfo.fbId,
              },
            }
          : undefined,
      },
      include: { fbInfo: true },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({ include: { fbInfo: true } });
  }

  async findOne(id: string): Promise<User & { fbInfo: UserFBInfo }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { fbInfo: true },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { fbInfo, ...userData } = updateUserDto;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        fbInfo: fbInfo
          ? {
              upsert: {
                create: {
                  accessToken: fbInfo.accessToken,
                  fbId: fbInfo.fbId,
                },
                update: {
                  accessToken: fbInfo.accessToken,
                  fbId: fbInfo.fbId,
                },
              },
            }
          : undefined,
      },
      include: { fbInfo: true },
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: { fbInfo: true },
    });
  }

  async findUsersByFbId(fbId: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        fbInfo: {
          fbId,
        },
      },
      include: { fbInfo: true },
    });
  }

  async upsertFacebookInfo(userId: string, fbInfo: Omit<UserFBInfoDto, 'id'>): Promise<UserFBInfo> {
    return this.prisma.userFBInfo.upsert({
      where: { userId },
      update: fbInfo,
      create: { ...fbInfo, userId },
    });
  }  

   async storeSession(userId: string, sessionId: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { session: sessionId },
    });
  }

  async getSession(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { session: true },
    });
    return user?.session ?? null;
  }
}