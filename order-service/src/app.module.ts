import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({
    isGlobal: true
  }), ClientsModule.register([
    {
      name: "PAYMENT_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "payment_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    }
  ])
],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}