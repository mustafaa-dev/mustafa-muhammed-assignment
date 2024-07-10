import { LoginDto } from '@auth/dtos';
import { LoginResponseInterface } from '@auth/interfaces/login-response.interface';

export interface AuthControllerInterface {
  login(loginDto: LoginDto): Promise<LoginResponseInterface>;
}
