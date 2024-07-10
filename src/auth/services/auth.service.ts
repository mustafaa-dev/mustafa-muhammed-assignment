import { Injectable } from '@nestjs/common';
import { LoginResponseInterface, UserTokenPayload } from '@auth/interfaces';
import { UsersService } from '@users/services/users.service';
import { UserEntity } from '@users/entites/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { addDays } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loggedInUser: UserEntity): Promise<LoginResponseInterface> {
    return {
      name: loggedInUser.name,
      role: loggedInUser.role.name,
      permissions: loggedInUser.role.has.map((p) => p.name),
      access_token: await this.generateJWT(loggedInUser),
      expires_at: addDays(
        new Date(),
        parseInt(this.configService.get<string>('JWT_EXPIRATION_TIME')),
      ),
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    return await this.usersService.validate(email, password);
  }

  private async generateJWT(user: UserEntity): Promise<string> {
    const payload: UserTokenPayload = {
      email: user.email,
      user_id: user.id,
      role: user.role.name,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow('JWT_EXPIRATION_TIME'),
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
  }
}
