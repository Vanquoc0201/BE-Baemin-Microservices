import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PaginationDto } from './dto/pagination-product.dto';
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly elasticsearchService : ElasticsearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async getAllProduct() {
    const cacheKey = 'all_products_cache';
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) {
      return {
        message: 'Lấy danh sách món ăn thành công (từ cache)',
        data: cachedData,
      };
    }
    const allProduct = await this.prismaService.foods.findMany();
    await this.cacheManager.set(cacheKey, allProduct, 60);
    return {
      message: 'Lấy danh sách món ăn thành công',
      data: allProduct,
    };
  }
  async getDetailProduct(foodId: string) {
    const numericFoodId = Number(foodId);
    if (isNaN(numericFoodId) || numericFoodId <= 0) {
      throw new BadRequestException('foodId không hợp lệ');
    }
    const existingProduct = await this.prismaService.foods.findUnique({
      where: { foodId: numericFoodId },
    });
    if (!existingProduct) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }
    return {
      message: 'Lấy thông tin sản phẩm thành công',
      data: existingProduct,
    };
  }
  async getAllProductType (){
        const productTypes = await this.prismaService.categories.findMany({
            where: {
                categoryName: {
                    not: null,
                },
            },
            distinct: ['categoryName'],
            select: {
                categoryName: true,
            },
        });
        if (!productTypes.length) {
            throw new BadRequestException('Không tìm thấy loại sản phẩm nào');
        }
        const response = productTypes.map((item) => item.categoryName); 
        return {
            message : 'Lấy danh sách loại sản phẩm thành công',
            data : response,
        }
  }
  async getAllProductPagination(paginationDto: PaginationDto) {
    let { page, pageSize, search } = paginationDto;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 3;
    search = search || '';
    const cacheKey = `pagination_products_page=${page}_size=${pageSize}_search=${search}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        fromCache: true,
      };
    }
    const skip = (page - 1) * pageSize;
    const where = {
      foodName: {
        contains: search,
        mode: 'insensitive',
      },
    };
    const [foods, totalItem] = await Promise.all([
      this.prismaService.foods.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        where,
      }),
      this.prismaService.foods.count({ where }),
    ]);

    const totalPage = pageSize > 0 ? Math.ceil(totalItem / pageSize) : 1;

    const result = {
      page,
      pageSize,
      totalItem,
      totalPage,
      items: foods,
    };

    await this.cacheManager.set(cacheKey, result, 60); // TTL 60 giây

    return result;
  }
  async searchProduct(foodName: string) {
    const result = await this.elasticsearchService.search({
      index: 'foods',
      query: {
        match: {
          foodName: {
            query: foodName,
            fuzziness: 'AUTO',
          },
        },
      },
    });
    const hits = result.hits.hits;
    if (!hits.length) {
      throw new BadRequestException('Không tìm thấy sản phẩm nào');
    }
    const foods = hits.map((hit) => hit._source);
    return foods;
  }

}
