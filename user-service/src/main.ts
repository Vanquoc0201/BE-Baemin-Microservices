import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:1234@localhost:5672'],
      queue: 'user_queue',
      queueOptions: {
        durable: true,
      },
      persistent: true,
    },
  });

  await app.listen();
  console.log('✅ User-service đã kết nối với RabbitMQ và đang lắng nghe...');
}
bootstrap();
