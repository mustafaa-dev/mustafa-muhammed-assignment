import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@users/entites/user.entity';
import { LoginResponseInterface } from '@auth/interfaces';
import { addDays } from 'date-fns';
import { AuthService } from '@auth/services/auth.service';
import { PermissionEntity } from '../../roles/entites/permission.entity';
import { RoleEntity } from '../../roles/entites/role.entity';

const user: UserEntity = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: {
    id: '1',
    name: 'admin',
    has: [
      { id: '1', name: 'read' },
      { id: '2', name: 'write' },
    ] as unknown as PermissionEntity[],
  } as unknown as RoleEntity,
} as unknown as UserEntity;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            validate: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid login response', async () => {
      const token = 'sample-token';
      const expirationTime = '7';

      jest.spyOn(service, 'generateJWT').mockResolvedValue(token);
      jest.spyOn(configService, 'get').mockReturnValue(expirationTime);

      const result: LoginResponseInterface = await service.login(user);

      expect(result).toEqual({
        name: user.name,
        role: user.role.name,
        permissions: user.role.has.map((p) => p.name),
        access_token: token,
        expires_at: addDays(new Date(), parseInt(expirationTime)),
      });
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      jest.spyOn(usersService, 'validate').mockResolvedValue(user);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(user);
    });
  });

  describe('generateJWT', () => {
    it('should generate a valid JWT', async () => {
      const payload = {
        email: user.email,
        user_id: user.id,
        role: user.role.name,
      };

      const token = 'sample-token';
      const secret = 'secret-key';
      const expirationTime = '7d';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      jest
        .spyOn(configService, 'getOrThrow')
        .mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') return secret;
          if (key === 'JWT_EXPIRATION_TIME') return expirationTime;
        });

      const result = await service.generateJWT(user);

      expect(result).toBe(token);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, {
        expiresIn: expirationTime,
        secret: secret,
      });
    });
  });
});
