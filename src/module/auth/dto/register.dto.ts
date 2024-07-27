import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsEmail()
    email: string

    @IsString()
    username: string

    @IsString()
    @IsStrongPassword()
    password: string

    @IsOptional()
    @IsString()
    name?: string
}