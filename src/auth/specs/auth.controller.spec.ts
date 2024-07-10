import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@auth/services/auth.service';
import { LoginResponseInterface } from '@auth/interfaces';
import { AuthController } from '@auth/controllers/auth.controller';
import { UserEntity } from '@users/entites/user.entity';
import { PermissionEntity } from '../../roles/entites/permission.entity';
import { RoleEntity } from '../../roles/entites/role.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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
  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a valid login response', async () => {
      const loginResponse: LoginResponseInterface = {
        name: user.name,
        role: user.role.name,
        permissions: user.role.has.map((p) => p.name),
        access_token: 'sample-token',
        expires_at: new Date(),
      };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await authController.login(user);

      expect(result).toEqual(loginResponse);
      expect(authService.login).toHaveBeenCalledWith(user);
    });
  });
});
