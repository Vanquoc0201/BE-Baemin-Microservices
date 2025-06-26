import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RegisterDto } from './dto/auth/regiser-auth.dto';
import { LoginDto } from './dto/auth/login-auth.dto';
import { RefreshTokenDto } from './dto/auth/refreshtoken-auth.dto';
import { ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from './dto/product/pagination-product.dto';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/order/create-order.dto';
@Controller("Auth")
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private authService : ClientProxy
  ) {}
  @Post('DangKy')
  async register(@Body() data: RegisterDto) {
    return this.authService.send('user_register', data);
  }
  @Post('DangNhap')
  async login(@Body() data: LoginDto) {
    return this.authService.send('user_login', data);
  }
  @Post('RefreshToken')
    async refreshToken(
        @Body()
        body : RefreshTokenDto
    ){
      return this.authService.send('user_refreshtoken',body)
  }
}
@Controller("Product")
export class ProductController{
  constructor(
    private readonly appService: AppService,
    @Inject('PRODUCT_SERVICE') private productService : ClientProxy
  ){}
  @Get('LayDanhSachSanPham')
  async getAllProduct(){
    return await firstValueFrom(this.productService.send('get_all_product', {}));
  }
  @Get('TimKiemSanPham')
  @ApiQuery({
        name: 'foodName',
        required: true,
        description: 'Tài khoản cần tìm kiếm',
        example: 'ga ran',
    })
  async searchProduct (
        @Query('foodName') foodName:string
    ) {
      return await firstValueFrom(this.productService.send('search_product', { foodName }));
  }
  @Get('LayDanhSachSanPhamPhanTrang')
  @ApiQuery({
        name: 'page',
        required: false,
        description: 'Nếu không truyền thì mặc định là 1',
        example: '1',
      })
      @ApiQuery({
        name: 'pageSize',
        required: false,
        description: 'Nếu không truyền thì mặc định là 3',
        example: '3',
      })
      @ApiQuery({
        name: 'search',
        required: false,
        description: 'Từ khóa tìm kiếm',
        example: 'ga ran',
      })
  async getAllProductPagination(
        @Query('page') page: string ,
        @Query('pageSize') pageSize: string,
        @Query('search') search: string
      ) {
        const paginationDto: PaginationDto = {
          page,
          pageSize,
          search,
        };
        return await firstValueFrom(this.productService.send('get_pagination_product',paginationDto));
  }
  @Get('LayThongTinSanPham')
  @ApiQuery({
      name: 'foodId',
      required: true,
      description: 'foodId phải là chữ số',
      example: '1',
    })
    async getDetailFood(
      @Query('foodId') foodId: string
    ){
      return await firstValueFrom(this.productService.send('get_detail_product',{foodId})) 
  }
  @Get('LayDanhSachLoaiSanPham')
  async getAllFoodType(){
      return await firstValueFrom(this.productService.send('get_product_type', {}));
  }
}
@Controller("Order")
export class OrderController{
  constructor(
    private readonly appService: AppService,
    @Inject('ORDER_SERVICE') private orderService : ClientProxy,
    @Inject('NOTIFY_SERVICE') private notifyService: ClientProxy,
  ){}
  @Post('DatHang')
  async createOrder(@Body() data: CreateOrderDto) {
    // Bước 1 : Gửi email xác nhận
    this.notifyService.emit('send_confirm_email', {})
    // Bước 2 : Tạo đơn hàng
    return firstValueFrom(this.orderService.send('create_order', data));
  }
  @Get('LayDanhSachDonHangCuaNguoiDung')
  async getOrdersByUser(@Query('userId') userId: string) {
    return firstValueFrom(this.orderService.send('get_orders_by_user', userId));
  }
  @Get('LayDanhSachChiTietDonHang')
  async getOrderDetail(@Query('orderId') orderId: string) {
    return firstValueFrom(this.orderService.send('get_order_detail', orderId));
  }
}
