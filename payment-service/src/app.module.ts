import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ HttpModule,ConfigModule.forRoot({
    isGlobal: true
  }), ClientsModule.register([
    {
      name: "NOTIFY_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "notify_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    },
    {
      name: "SHIPPING_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "shipping_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    },
  ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}