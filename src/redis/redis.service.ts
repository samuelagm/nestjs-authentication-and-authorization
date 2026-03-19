import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { IORedisKey } from './redis.constants';

@Injectable()
export class RedisService {
  private readonly localStore = new Map<string, string>();

  constructor(
    @Inject(IORedisKey)
    private readonly redisClient: Redis | null,
  ) {}

  async getKeys(pattern?: string): Promise<string[]> {
    if (!this.redisClient) {
      const matcher = pattern || '*';
      const regex = new RegExp(`^${matcher.replace(/\*/g, '.*')}$`);
      return [...this.localStore.keys()].filter((key) => regex.test(key));
    }

    try {
      return await this.redisClient.keys(pattern);
    } catch {
      return [...this.localStore.keys()];
    }
  }

  async insert(key: string, value: string | number): Promise<void> {
    this.localStore.set(key, String(value));

    if (!this.redisClient) {
      return;
    }

    try {
      await this.redisClient.set(key, value);
    } catch {
      return;
    }
  }

  async get(key: string): Promise<string> {
    if (!this.redisClient) {
      return this.localStore.get(key);
    }

    try {
      const value = await this.redisClient.get(key);
      return value ?? this.localStore.get(key);
    } catch {
      return this.localStore.get(key);
    }
  }

  async delete(key: string): Promise<void> {
    this.localStore.delete(key);

    if (!this.redisClient) {
      return;
    }

    try {
      await this.redisClient.del(key);
    } catch {
      return;
    }
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.get(key);
    return storedValue === value;
  }
}
