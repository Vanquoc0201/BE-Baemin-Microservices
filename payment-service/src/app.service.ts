import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_CLIENT_ID } from './common/constant/app.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,

    @Inject('SHIPPING_SERVICE')
    private readonly shipping_service: ClientProxy,

    @Inject('NOTIFY_SERVICE')
    private readonly notify_service: ClientProxy,
  ) {}

  async createPayment(data: CreatePaymentDto) {
    const orderCode = Date.now(); // tạo mã đơn hàng tạm thời

    const rawSignature = `amount=${data.amount}&cancelUrl=${data.cancelUrl}&description=${data.description}&orderCode=${orderCode}&returnUrl=${data.returnUrl}`;
    const signature = crypto
      .createHmac('sha256', PAYOS_CHECKSUM_KEY as string)
      .update(rawSignature)
      .digest('hex');

    const payload = {
      orderCode,
      amount: data.amount,
      description: data.description,
      returnUrl: data.returnUrl,
      cancelUrl: data.cancelUrl,
      buyerName: data.buyerInfo.name,
      buyerEmail: data.buyerInfo.email,
      buyerPhone: data.buyerInfo.phone,
      buyerAddress: data.buyerInfo.address,
      items: data.items,
      signature,
    };

    // B1: Gửi yêu cầu thanh toán
    const response = await this.httpService.axiosRef.post(
      'https://api-merchant.payos.vn/v2/payment-requests',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': PAYOS_CLIENT_ID,
          'x-api-key': PAYOS_API_KEY,
        },
      },
    );

    // B4: Gửi yêu cầu tạo shipping (giả lập)
    const shippingData = await lastValueFrom(
      this.shipping_service.send('create_shipping', {
        orderCode,
        address: data.buyerInfo.address,
        shipperName: data.buyerInfo.name,
      }),
    );

    // B5: Gửi thông báo mail (giả lập)
    this.notify_service.emit('send_success_email', {});

    return {
      paymentResponse: response.data,
      shippingData,
      message: 'Thanh toán + tạo đơn giao hàng + gửi mail thành công!',
    };
  }
}
