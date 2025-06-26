import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/regiser-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refreshtoken-auth.dto';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constant/app.constant';
import { PrismaService } from './prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TokenService } from './token.service';



@Controller()
export class AppController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  @MessagePattern('user_register')
  async register(@Payload() body: RegisterDto) {
    try {
      const userExists = await this.prismaService.users.findUnique({
        where: { email: body.email },
      });

      if (userExists)
        throw new BadRequestException('Email đã tồn tại vui lòng đăng nhập');

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const userNew = await this.prismaService.users.create({
        data: {
          ...body,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = userNew;

      return {
        message: 'Đăng ký thành công',
        ...userWithoutPassword,
      };
    } catch (error) {
      console.error('Đăng ký lỗi:', error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email đã tồn tại!');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Lỗi máy chủ, vui lòng thử lại sau',
      );
    }
  }

  @MessagePattern('user_login')
  async login(@Payload() body: LoginDto) {
    const userExists = await this.prismaService.users.findUnique({
      where: { email: body.email },
    });

    if (!userExists) {
      throw new BadRequestException(
        'Tài khoản chưa được đăng ký, vui lòng đăng ký',
      );
    }

    if (!userExists.password) {
      throw new BadRequestException('Mật khẩu không hợp lệ');
    }

    const isPassword = await bcrypt.compare(
      body.password,
      userExists.password,
    );

    if (!isPassword) {
      throw new BadRequestException('Mật khẩu không chính xác');
    }

    const tokens = this.tokenService.createToken(userExists.userId);
    const { password, ...userWithoutPassword } = userExists;

    return {
      message: 'Đăng nhập thành công',
      ...tokens,
      user: userWithoutPassword,
    };
  }

  @MessagePattern('user_refreshtoken')
  async refreshToken(@Payload() body: RefreshTokenDto) {
    const { accessToken, refreshToken } = body;

    if (!accessToken) {
      throw new UnauthorizedException('Không có access token');
    }

    if (!refreshToken) {
      throw new UnauthorizedException('Không có refresh token');
    }

    let decodeAccessToken: any;
    let decodeRefreshToken: any;

    try {
      decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, {
        ignoreExpiration: true,
      });
    } catch (error) {
      throw new UnauthorizedException('Access token không hợp lệ');
    }

    try {
      decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const tokens = this.tokenService.createToken(decodeRefreshToken.userId);
    return {
      message: 'Làm mới token thành công',
      ...tokens,
    };
  }
}
