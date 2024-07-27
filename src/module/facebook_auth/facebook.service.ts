import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { FacebookDto } from './dto/facebook.dto';

@Injectable()
export class FacebookService {
    constructor(private prisma: PrismaService) { }

    async validateFacebookLogin(profile: FacebookDto, accessToken: string) {
        try {
            // Check user already exists
            let user = await this.prisma.user.findUnique({
                where: { email: profile.email },
                include: {
                    FacebookInfo: {
                        include: {
                            facebookInfoSecrets: true
                        }
                    }
                },
            });

            if (!user) {
                // Create a new user if not exists
                user = await this.prisma.user.create({
                    data: {
                        email: profile.email,
                        username: profile.email, // You might want to generate a unique username
                        password: '@Password123',
                        name: profile.name,
                        FacebookInfo: {
                            create: {
                                fbId: profile.id.toString(), // Convert to string
                                name: profile.name,
                                first_name: profile.first_name,
                                last_name: profile.last_name,
                                email: profile.email,
                                profile_picture_url: profile.profile_picture_url,
                                facebookInfoSecrets: {
                                    create: {
                                        fbAccessToken: accessToken,
                                    },
                                },
                            },
                        },
                    },
                    include: {
                        FacebookInfo: {
                            include: {
                                facebookInfoSecrets: true
                            }
                        }
                    },
                });
            } else if (!user.FacebookInfo[0]) {
                // If user exists but FacebookInfo doesn't, create it
                await this.prisma.facebookInfo.create({
                    data: {
                        userId: user.id,
                        fbId: profile.id.toString(), // Convert to string
                        name: profile.name,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        email: profile.email,
                        profile_picture_url: profile.profile_picture_url,
                        facebookInfoSecrets: {
                            create: {
                                fbAccessToken: accessToken,
                            },
                        },
                    },
                });
            } else {
                // Update existing FacebookInfo and FacebookInfoSecret
                await this.prisma.facebookInfo.update({
                    where: { id: user.FacebookInfo[0].id },
                    data: {
                        fbId: profile.id.toString(), // Convert to string
                        name: profile.name,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        email: profile.email,
                        profile_picture_url: profile.profile_picture_url,
                        facebookInfoSecrets: {
                            update: {
                                where: { id: user.FacebookInfo[0].facebookInfoSecrets[0].id },
                                data: { fbAccessToken: accessToken },
                            },
                        },
                    },
                });
            }

            return user;
        } catch (error) {
            console.error('Error during Facebook login:', error);
            throw new Error('Failed to validate Facebook login');
        }
    }
}