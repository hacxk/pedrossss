import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, IsUrl, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsInt()
  @IsNotEmpty()
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USER: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsUrl()
  @IsNotEmpty()
  AUTH_API_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsInt()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: number;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_SECRET: string;

  @IsString()
  @IsNotEmpty()
  FACEBOOK_APP_ID: string;

  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
