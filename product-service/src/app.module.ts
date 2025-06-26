import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { ElasticModule } from './elastic/elastic.module';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), RedisCacheModule,ElasticModule
  ],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}