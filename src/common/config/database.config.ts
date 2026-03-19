import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const isConfigured = [
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME,
  ].every(Boolean);

  return {
    isConfigured,
    type: isConfigured ? 'mysql' : 'sqljs',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  };
});
