import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    fbInfo?: CreateUserFBInfoDto;

    @IsOptional()
    fbInfoId?: string; // Optionally provide the ID of an existing UserFBInfo
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    fbInfo?: UpdateUserFBInfoDto;
}

export class UserDto {
    @IsUUID()
    id: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsOptional()
    fbInfo?: UserFBInfoDto;
}

export class UserFBInfoDto {
    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    accessToken: string; 

    @IsString()
    @IsNotEmpty()
    fbId: string;
}

export class CreateUserFBInfoDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    accessToken: string; 

    @IsString()
    @IsNotEmpty()
    fbId: string;
}

export class UpdateUserFBInfoDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    accessToken?: string; 

    @IsString()
    @IsOptional()
    fbId?: string;
}
