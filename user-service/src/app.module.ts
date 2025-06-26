import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRES, ACCESS_TOKEN_SECRET } from './constant/app.constant';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }),
  JwtModule.register({
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES },
    }),
  ClientsModule.register([
    {
      name: "USER_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "user_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    }
  ])
],
  controllers: [AppController],
  providers: [AppService,TokenService],
})
export class AppModule {}