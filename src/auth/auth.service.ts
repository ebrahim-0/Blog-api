import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/Role.enum';
import { generateToken } from 'src/utils/generateToken';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: {
        ...user,
        role: Role.user,
      },
    });

    const { password, ...userWithoutPassword } = createdUser;

    const accessToken = generateToken(userWithoutPassword, '1d');
    const refreshToken = generateToken(userWithoutPassword, '30d');

    await this.prisma.user.update({
      where: { id: createdUser.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken, user: userWithoutPassword };
  }

  async login(user: LoginUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      throw new BadRequestException('User with this email does not exist');
    }

    const isValidPassword = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Invalid password');
    }

    const { password, refreshToken, ...userWithoutPassword } = existingUser;

    const accessToken = generateToken(userWithoutPassword, '1m');
    const newRefreshToken = generateToken(userWithoutPassword, '30d');

    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: userWithoutPassword,
    };
  }
}
