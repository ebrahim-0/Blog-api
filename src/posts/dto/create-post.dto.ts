import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Post title',
    required: true,
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Post content',
    required: true,
  })
  content: string;

  published: boolean;

  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
