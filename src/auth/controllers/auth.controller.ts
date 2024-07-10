import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/services/auth.service';
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthControllerInterface,
  LoginResponseInterface,
} from '@auth/interfaces';
import { LocalAuthGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserEntity } from '@users/entites/user.entity';
import { PublicRoute } from '@auth/decorators';
import { LoginDto } from '@auth/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements AuthControllerInterface {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiAcceptedResponse({ description: 'User Login' })
  @ApiConflictResponse({ description: 'Invalid Credentials' })
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
  ): Promise<LoginResponseInterface> {
    return this.authService.login(user);
  }
}
