import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

class BuyerInfo {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  address: string;
}

class Item {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUrl()
  returnUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  cancelUrl?: string;

  @ApiProperty({ type: BuyerInfo })
  @ValidateNested()
  @Type(() => BuyerInfo)
  buyerInfo: BuyerInfo;

  @ApiProperty({ type: [Item] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];
}