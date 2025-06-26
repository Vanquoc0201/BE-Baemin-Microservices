import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { PaginationDto } from './dto/pagination-product.dto';
@Controller("Product")
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
  @Get()
  @MessagePattern('get_all_product')
  async getAllProduct() {
    return await this.appService.getAllProduct();
  }
  @MessagePattern('get_detail_product')
  async getDetailProduct(payload: { foodId: string }) {
    return this.appService.getDetailProduct(payload.foodId);
  }
  @MessagePattern('get_product_type')
  async getAllProductType() {
    return await this.appService.getAllProductType();
  }
  @MessagePattern('get_pagination_product')
  async getAllProductPagination(payload : PaginationDto) {
    return await this.appService.getAllProductPagination(payload);
  }
  @MessagePattern('search_product')
  async searchProduct(payload: { foodName: string }) {
    return this.appService.searchProduct(payload.foodName);
  }
}
