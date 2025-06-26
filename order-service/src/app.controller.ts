import { Body, Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
  @MessagePattern('create_order')
  async create(@Payload() data: CreateOrderDto) {
    return await this.appService.createOrder(data);
  }
  @MessagePattern('get_orders_by_user')
  async getOrdersByUser(@Payload() userId: string) {
    return this.appService.getOrdersByUser(userId);
  }
  @MessagePattern('get_order_detail')
  async getOrderDetail(@Payload() orderId: string) {
    return this.appService.getOrderDetail(orderId);
  }
}
