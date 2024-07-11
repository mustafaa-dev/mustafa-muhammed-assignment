import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/services/auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthControllerInterface,
  LoginResponseInterface,
} from '@auth/interfaces';
import { LocalAuthGuard } from '@auth/guards';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserEntity } from '@users/entites/user.entity';
import { PublicRoute } from '@auth/decorators';
import { LoginDto, RegisterDto } from '@auth/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController implements AuthControllerInterface {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful, returns JWT token' })
  @ApiCreatedResponse({ description: 'User Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiConflictResponse({ description: 'Invalid Credentials' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
  ): Promise<LoginResponseInterface> {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'User Register' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User Register' })
  @ApiConflictResponse({ description: 'Duplicated' })
  @ApiBadRequestResponse({ description: 'Bad input' })
  @PublicRoute()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<LoginResponseInterface> {
    return this.authService.register(registerDto);
  }
}
