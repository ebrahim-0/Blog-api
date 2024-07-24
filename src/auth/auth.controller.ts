import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
      token: newUser.token,
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
      token: existingUser.token,
    };
  }
}
