import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => {
  return {
    siteTitle: process.env.SWAGGER_SITE_TITLE || 'NestJS Authentication API',
    docTitle: process.env.SWAGGER_DOC_TITLE || 'NestJS Authentication',
    docDescription:
      process.env.SWAGGER_DOC_DESCRIPTION ||
      'Authentication API running in self-contained mode',
    docVersion: process.env.SWAGGER_DOC_VERSION || '1.0.0',
  };
});
