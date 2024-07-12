import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'super@otm.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    example: `StrongPassword1020!@#`,
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
