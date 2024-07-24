import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/Role.enum';

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

    if (user.role === Role.Admin) {
      throw new UnauthorizedException('Only admins can create admin accounts');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: user,
    });

    const { password, ...userWithoutPassword } = createdUser;

    const token = jwt.sign({ ...userWithoutPassword }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { token, user: userWithoutPassword };
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

    const { password, ...userWithoutPassword } = existingUser;

    const token = jwt.sign({ ...userWithoutPassword }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return { token, user: userWithoutPassword };
  }
}
