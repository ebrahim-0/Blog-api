import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private _AuthService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Details of the user to be registered',
  })
  async register(@Body() user: CreateUserDto) {
    const newUser = await this._AuthService.createUser(user);
    return {
      message: 'User created successfully',
      user: newUser.user,
      accessToken: newUser.accessToken,
      refreshToken: newUser.refreshToken,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({
    type: LoginUserDto,
    description: 'Details of the user to be logged in',
  })
  async login(@Body() user: LoginUserDto) {
    const existingUser = await this._AuthService.login(user);
    return {
      message: 'User logged in successfully',
      user: existingUser.user,
      accessToken: existingUser.accessToken,
      refreshToken: existingUser.refreshToken,
    };
  }

  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.headers['x-refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenString = Array.isArray(refreshToken)
      ? refreshToken[0]
      : refreshToken;

    try {
      const { user, accessToken, refreshToken } =
        await this._AuthService.refreshToken(tokenString);

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: forgotPasswordDto) {
    try {
      return await this._AuthService.forgotPassword(body);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Post('reset-password/:userId/:token')
  async resetPassword(
    @Param('userId') userId: string,
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      return await this._AuthService.resetPassword(
        userId,
        token,
        resetPasswordDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('check-reset-token')
  async checkResetToken(@Body() body: { token: string }) {
    try {
      return await this._AuthService.checkResetToken(body.token);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
  