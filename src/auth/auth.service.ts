import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enum/Role.enum';
import { JwtService } from '@nestjs/jwt';
import { forgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly _MailerService: MailerService,
  ) {}

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

    // const accessToken = generateToken(userWithoutPassword, '1d');
    // const refreshToken = generateToken(userWithoutPassword, '30d');

    const accessToken = this.jwtService.sign(userWithoutPassword, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15s',
    });

    const refreshToken = this.jwtService.sign(userWithoutPassword, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });

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

    const accessToken = this.jwtService.sign(userWithoutPassword, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15s',
    });

    const newRefreshToken = this.jwtService.sign(userWithoutPassword, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });
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

  async refreshToken(refreshToken: string) {
    const user = await this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const { iat, exp, ...userWithoutExp } = user;

    const accessToken = this.jwtService.sign(userWithoutExp, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15s',
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(forgotPasswordDto: forgotPasswordDto) {
    const email = forgotPasswordDto.email;
    const baseURL = forgotPasswordDto.baseURL;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException("User Doesn't Exist");
    }

    const payload = { id: user.id, email };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isRestToken: false },
    });
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '10m',
    });

    const link = `${baseURL}/reset-password?userId=${user.id}&token=${token}`;

    const sendMail = await this._MailerService.sendMail({
      from: `Blog App <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: 'Reset Password',
      text: 'Reset Password',
      html: `<a href="${link}">Reset Password</a>`,
    });

    if (!sendMail) {
      throw new BadRequestException('Email Not Sent');
    }

    return {
      message: 'Email Sent Successfully check your email',
    };
  }

  async resetPassword(
    userId: string,
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ) {
    try {
      const id = +userId;

      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException("User Doesn't Exist");
      }

      if (user.isRestToken) {
        throw new BadRequestException('Invalid or already used token');
      }

      let payload = null;

      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (user.id !== payload.id) {
        throw new BadRequestException('Invalid Token');
      }

      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.new_password,
        10,
      );

      await this.prisma.user.update({
        where: { id },
        data: { password: hashedPassword, isRestToken: true },
      });

      return {
        message: 'Password Reset Successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('token is invalid or expired');
    }
  }
}
