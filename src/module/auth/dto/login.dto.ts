import { IsEmail, IsOptional, IsString } from "class-validator";
import { IsUsernameOrEmail } from "src/helpers/validators/either.validator";

export class LoginDto {
    @IsString()
    @IsOptional()
    username?: string

    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string

    @IsString()
    password: string

    @IsUsernameOrEmail()
    validateUsernameOrEmail() {}
}