import { IsString, IsOptional, ValidateIf, IsDefined, IsEmail, IsNotEmpty, MinLength, Matches } from "class-validator";
import { Match } from "src/shared/validater/match.validater";

function IsUsernameOrEmail() {
    return function (object: Object, propertyName: string) {
        ValidateIf(o => o.username || o.email)(object, propertyName);
        IsDefined({ message: 'Either username or email must be provided.' })(object, propertyName);
    };
}

export class LoginDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @ValidateIf((o) => o.username || o.email)
    @IsNotEmpty({ message: 'Either username or email must be provided.' })
    dummy?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match('password')
    confirmPassword: string;
}