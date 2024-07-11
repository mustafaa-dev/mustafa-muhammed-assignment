import { LoginDto, RegisterDto } from '@auth/dtos';
import { LoginResponseInterface } from '@auth/interfaces/login-response.interface';

export interface AuthServiceInterface {
  register(registerDto: RegisterDto): Promise<LoginResponseInterface>;

  login(loginDto: LoginDto): Promise<LoginResponseInterface>;
}
