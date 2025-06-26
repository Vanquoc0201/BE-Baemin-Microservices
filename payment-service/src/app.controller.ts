import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern('create_payment')
  async handleCreatePayment(@Payload() payload: CreatePaymentDto) {
    return await this.appService.createPayment(payload);
  }
}
