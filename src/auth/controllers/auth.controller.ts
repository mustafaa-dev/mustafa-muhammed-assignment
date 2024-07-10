import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthControllerInterface,
  LoginResponseInterface,
} from '@auth/interfaces';
import { LocalAuthGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserEntity } from '@users/entites/user.entity';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements AuthControllerInterface {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
  ): Promise<LoginResponseInterface> {
    return this.authService.login(user);
  }
}
