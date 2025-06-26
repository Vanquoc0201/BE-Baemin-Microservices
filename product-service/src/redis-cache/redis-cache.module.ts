import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
            auth_pass: configService.get('REDIS_PASSWORD'),
            ttl: configService.get('REDIS_TTL'),
        }),
        inject: [ConfigService],
        isGlobal: true,
        }),
    ],
})
export class RedisCacheModule {}