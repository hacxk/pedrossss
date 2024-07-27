import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class FacebookDto {
    id: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    profile_picture_url?: string;
}
