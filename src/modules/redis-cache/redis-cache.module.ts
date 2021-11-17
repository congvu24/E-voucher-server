import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: () => ({
    //     // store: redisStore,
    //     host: 'localhost',
    //     ttl: 30,
    //   }),
    // }),
    CacheModule.register(),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService, CacheModule], // This is IMPORTANT,  you need to export RedisCacheService here so that other modules can use it
})
export class RedisCacheModule {}
