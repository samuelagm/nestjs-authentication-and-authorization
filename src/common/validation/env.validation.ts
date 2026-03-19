import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

import { Environment } from '../enums/environment.enum';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsOptional()
  DB_HOST: string;

  @IsNumber()
  @IsOptional()
  DB_PORT: number;

  @IsString()
  @IsOptional()
  DB_USER: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD: string;

  @IsString()
  @IsOptional()
  DB_NAME: string;

  @IsString()
  @IsOptional()
  REDIS_HOST: string;

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number;

  @IsString()
  @IsOptional()
  REDIS_USERNAME: string;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD: string;

  @IsNumber()
  @IsOptional()
  REDIS_DATABASE: number;

  @IsString()
  @IsOptional()
  REDIS_KEY_PREFIX: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsNumber()
  JWT_ACCESS_TOKEN_TTL: number;

  @IsString()
  @IsOptional()
  SWAGGER_SITE_TITLE: string;

  @IsString()
  @IsOptional()
  SWAGGER_DOC_TITLE: string;

  @IsString()
  @IsOptional()
  SWAGGER_DOC_DESCRIPTION: string;

  @IsString()
  @IsOptional()
  SWAGGER_DOC_VERSION: string;
}

export function validate(config: Record<string, unknown>) {
  const configWithDefaults = {
    NODE_ENV: config.NODE_ENV || Environment.Development,
    PORT: config.PORT || 3000,
    JWT_SECRET: config.JWT_SECRET || 'development-only-secret',
    JWT_ACCESS_TOKEN_TTL: config.JWT_ACCESS_TOKEN_TTL || 3600,
    SWAGGER_SITE_TITLE:
      config.SWAGGER_SITE_TITLE || 'NestJS Authentication API',
    SWAGGER_DOC_TITLE: config.SWAGGER_DOC_TITLE || 'NestJS Authentication',
    SWAGGER_DOC_DESCRIPTION:
      config.SWAGGER_DOC_DESCRIPTION ||
      'Authentication API running in self-contained mode',
    SWAGGER_DOC_VERSION: config.SWAGGER_DOC_VERSION || '1.0.0',
    ...config,
  };

  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    configWithDefaults,
    {
      enableImplicitConversion: true,
    },
  );
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  let errorMessage = errors
    .map((message) => message.constraints[Object.keys(message.constraints)[0]])
    .join('\n');

  const COLOR = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    fgRed: '\x1b[31m',
  };

  errorMessage = `${COLOR.fgRed}${COLOR.bright}${errorMessage}${COLOR.reset}`;

  if (errors.length > 0) {
    throw new Error(errorMessage);
  }

  return validatedConfig;
}
