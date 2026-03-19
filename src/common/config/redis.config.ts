import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  const isConfigured = Boolean(process.env.REDIS_HOST);

  return {
    isConfigured,
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    db: parseInt(process.env.REDIS_DATABASE, 10) || 0,
    keyPrefix: `${process.env.REDIS_KEY_PREFIX || 'nest-auth'}:`,
    ...(process.env.REDIS_USERNAME && {
      username: process.env.REDIS_USERNAME,
    }),
    ...(process.env.REDIS_PASSWORD && {
      password: process.env.REDIS_PASSWORD,
    }),
  };
});
