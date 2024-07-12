import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'mostafa.mohammed1235@gmail.com',
    description: 'Email of the user, must be unique',
    type: String,
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'StrongPassword1020!@#',
    description: 'Password of the user, must be strong',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password is too weak' })
  password: string;

  @ApiProperty({
    example: 'Mustafa Muhammed',
    description: 'Name of the user',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
