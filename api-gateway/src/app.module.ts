import { Module } from '@nestjs/common';
import { AppController, OrderController, ProductController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: "PRODUCT_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "product_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    },
    {
      name: "ORDER_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:1234@localhost:5672'],
        queue: "order_queue",
        queueOptions: {
          durable: true
        },
        persistent: true
      }
    },
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
    },
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
    },
  ])],
  controllers: [AppController,ProductController,OrderController],
  providers: [AppService],
})
export class AppModule {}