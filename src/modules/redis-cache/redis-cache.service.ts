import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key): Promise<any> {
    return this.cache.get(key);
  }

  async set(key, value): Promise<any> {
    console.log('set');
    return this.cache.set(key, value, { ttl: 10 });
  }

  async clear(): Promise<any> {
    console.log('clear');
    return this.cache.reset();
  }
}
