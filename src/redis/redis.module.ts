import { Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';

import { IORedisKey } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IORedisKey,
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');

        if (!redisConfig.isConfigured) {
          return null;
        }

        const client = new Redis({
          ...redisConfig,
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
        });

        try {
          await client.connect();
        } catch {
          return null;
        }

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    void signal;
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get<Redis | null>(IORedisKey);
      if (!redis) {
        resolve();
        return;
      }

      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
