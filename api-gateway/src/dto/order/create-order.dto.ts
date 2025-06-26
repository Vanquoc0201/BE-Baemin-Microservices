import { IsArray, IsInt, ValidateNested, Min, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  foodId: number;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 2 })
  quantity: number;
}

export class CreateOrderDto {
  @IsInt()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({
    type: [OrderItemDto],
    example: [
      { foodId: 1, quantity: 2 },
      { foodId: 3, quantity: 1 },
    ],
  })
  items: OrderItemDto[];

  @IsString()
  @Length(2, 100)
  @ApiProperty({ example: 'Nguyễn Văn Tài', description: 'Tên người giao hàng' })
  shipperName: string;

  @IsString()
  @Length(5, 200)
  @ApiProperty({ example: '123 Lê Văn Sỹ, Quận 3, TP.HCM', description: 'Địa chỉ giao hàng' })
  address: string;
}