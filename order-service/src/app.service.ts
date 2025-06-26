import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, of, retry, timeout } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private prismaService: PrismaService,
    @Inject('PAYMENT_SERVICE') private payment_service: ClientProxy,
  ) {}
  async createOrder(body: CreateOrderDto) {
    const { userId, items, shipperName, address } = body;

    const foodIds = items.map(item => item.foodId);

    const foods = await this.prismaService.foods.findMany({
      where: { foodId: { in: foodIds } },
    });

    if (foods.length !== foodIds.length) {
      throw new BadRequestException('Một số món ăn không hợp lệ');
    }

    let totalPrice = 0;
    const orderItems = items.map((item) => {
      const food = foods.find((f) => f.foodId === item.foodId);
      if (!food) {
        throw new BadRequestException(`Không tìm thấy món ăn`);
      }
      const price = food.foodPrice ?? 0;
      totalPrice += price * item.quantity;
      return {
        foodId: item.foodId,
        quantity: item.quantity,
        unitPrice: price,
      };
    });

    const order = await this.prismaService.$transaction(async (tx) => {
      const createdOrder = await tx.orders.create({
        data: {
          userId,
          totalPrice,
        },
      });

      await tx.orderItems.createMany({
        data: orderItems.map((item) => ({
          ...item,
          orderId: createdOrder.orderId,
        })),
      });

      await tx.deliveries.create({
        data: {
          orderId: createdOrder.orderId,
          shipperName,
          address,
          status: 'pending',
        },
      });

      return createdOrder;
    });

    // Lấy thông tin người dùng
    const user = await this.prismaService.users.findUnique({
      where: { userId },
      select: {
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    const itemDetails = items.map(item => {
      const food = foods.find(f => f.foodId === item.foodId);
      return {
        name: food?.foodName || 'Unknown',
        quantity: item.quantity,
        price: food?.foodPrice || 0,
      };
    });

    // Gửi request tạo payment
    const paymentData = await lastValueFrom(
      this.payment_service
        .send('create_payment', {
          amount: totalPrice,
          description: `Thanh toán đơn hàng #${order.orderId}`,
          returnUrl: 'http://localhost:3000/return',
          cancelUrl: 'http://localhost:3000/cancel',
          buyerInfo: {
            name: user?.name || 'Khách hàng',
            email: user?.email || 'guest@example.com',
            phone: user?.phone || '0123456789',
            address: user?.address || address,
          },
          items: itemDetails,
        })
        .pipe(
          timeout(5000),
          retry(3),
          catchError((err) => {
            console.error('Payment service unavailable:', err);
            return of({ error: 'Payment service unavailable' });
          }),
        ),
    );

    return {
      message: 'Tạo đơn hàng thành công',
      orderId: order.orderId,
      totalPrice,
      payment: paymentData,
    };
  }
  async getOrdersByUser(userId: string) {
        const userIdNumber = +userId
        const orders = await this.prismaService.orders.findMany({
            where : {
                userId: +userIdNumber,
                isDeleted : false
            },
            include : {
                OrderItems: {
                    include : {
                        Foods: {
                            select : {
                                foodName: true,
                                foodPrice: true,
                            }
                        }
                    }
                }
            },
            orderBy : {
                createdAt: 'desc',
            }
        })
        if (!orders || orders.length === 0) {
            throw new NotFoundException('Người dùng chưa có đơn hàng nào');
        }
        return orders.map(order => ({
            orderId: order.orderId,
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
            orderItems: order.OrderItems.map(item => ({
                foodName: item.Foods.foodName,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
            })),
        }));
  }
  async getOrderDetail(orderId: string) {
        const orderIdNumber = +orderId;
        const order = await this.prismaService.orders.findUnique({
                where: { orderId: orderIdNumber },
                include: {
                    OrderItems: {
                        include: {
                            Foods: {
                                select: {
                                foodName: true,
                                foodPrice: true,
                                },
                            },
                        },
                    },
                },
            });
        if (!order) {
            throw new NotFoundException('Không tìm thấy đơn hàng');
        }
        const simplifiedOrder = {
            orderId: order.orderId,
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
            items: order.OrderItems.map((item) => ({
            foodName: item.Foods?.foodName,
            foodPrice: item.Foods?.foodPrice,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            })),
        };
        return {
            message: 'Lấy chi tiết đơn hàng thành công',
            data: simplifiedOrder,
        };
  }

}
