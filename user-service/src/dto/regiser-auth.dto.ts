import { IsString, IsNotEmpty, IsNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
   @IsString({message: 'name phải là chuỗi'})
   @IsNotEmpty({ message: 'name không được để trống'})
  @ApiProperty({ example: 'Võ Văn Quốc' })
   name: string;

   @IsString({message: 'email phải là chuỗi'})
   @IsNotEmpty({ message: 'email không được để trống'})
  @ApiProperty({ example: 'vovanquoc0201@gmail.com' })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'Email không đúng định dạng' })
   email: string;

    @IsString({message : 'Password phải là chuỗi'})
    @IsNotEmpty({message : 'Password không được để trống'})
    @ApiProperty({example : '123456', description: 'Password của bạn'})
    password : string;

    @IsString({message : 'Địa chỉ phải là chuỗi'})
    @IsNotEmpty({message : 'Địa chỉ không được để trống'})
    @ApiProperty({example : '13/5 Đông Hưng Thuận 19', description: 'Địa chỉ của bạn'})
    address : string;

    @IsString({message : 'Số điện thoại phải là chuỗi'})
    @IsNotEmpty({message : 'Số điện thoại không được để trống'})
    @ApiProperty({example : '0342701549', description: 'Số điện thoại của bạn'})
    phone : string;
}