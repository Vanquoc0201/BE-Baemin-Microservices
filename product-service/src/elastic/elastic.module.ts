import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ELASTIC_NODE')!,
        auth: {
          username: configService.get<string>('ELASTIC_USER')!,
          password: configService.get<string>('ELASTIC_PASS')!,
        },
        tls: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticModule {}
