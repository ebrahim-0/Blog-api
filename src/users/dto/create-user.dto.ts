import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from 'src/enum/Role-enum';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    required: true,
  })
  name: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@test.com',
    required: true,
  })
  email: string;

  @IsOptional()
  role: Role;

  created_at: Date;
  updated_at: Date;
}

export class CreateUserDto extends UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*).+$'), {
    message: 'Password too weak',
  })
  @ApiProperty({
    required: true,
  })
  password: string;
}

export class LoginUserDto {
  @IsOptional()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'test@test.com',
    required: true,
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
  })
  password: string;
}
