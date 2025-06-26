import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('create_shipping')
  async createShipping(@Payload() data: { orderCode: number; address: string; shipperName: string }) {
    const { orderCode, address, shipperName } = data;
    const shippingInfo = {
      shippingId: Date.now(),
      orderCode,
      address,
      shipperName,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 ngày sau
    };
    console.log('Đã nhận yêu cầu tạo shipping:', shippingInfo);
    return {
      message: 'Shipping created (mock)',
      data: shippingInfo,
    };
  }
}
