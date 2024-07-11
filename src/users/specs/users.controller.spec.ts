import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@users/services/users.service';
import { AddUserDto, UpdateUserDto } from '@users/dtos';
import { JwtAuthGuard } from '@auth/guards';
import { PermissionGuard, RoleGuard } from '@auth/guards/permission.guard';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { UsersController } from '@users/controllers/users.controller';
import { UserEntity } from '@users/entites/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    addOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionGuard)
      .useValue({ canActivate: () => true })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const user = new UserEntity();
      mockUsersService.getProfile.mockResolvedValue(user);

      expect(await usersController.getProfile(user)).toBe(user);
      expect(mockUsersService.getProfile).toHaveBeenCalledWith(user);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user profile', async () => {
      const user = new UserEntity();
      const updateUserDto = new UpdateUserDto();
      mockUsersService.updateProfile.mockResolvedValue(user);

      expect(await usersController.updateProfile(user, updateUserDto)).toBe(
        user,
      );
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(
        user,
        updateUserDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const paginatedUsers = { data: [], meta: {} } as Paginated<UserEntity>;
      const query: PaginateQuery = {} as PaginateQuery;
      mockUsersService.findAll.mockResolvedValue(paginatedUsers);

      expect(await usersController.findAll(query)).toBe(paginatedUsers);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new UserEntity();
      mockUsersService.findOne.mockResolvedValue(user);

      expect(await usersController.findOne('1')).toBe(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('addOne', () => {
    it('should add and return a new user', async () => {
      const user = new UserEntity();
      const addUserDto = new AddUserDto();
      mockUsersService.addOne.mockResolvedValue(user);

      expect(await usersController.addOne(addUserDto, user)).toBe(user);
      expect(mockUsersService.addOne).toHaveBeenCalledWith(addUserDto, user);
    });
  });

  describe('updateOne', () => {
    it('should update and return a user by id', async () => {
      const user = new UserEntity();
      const updateUserDto = new UpdateUserDto();
      mockUsersService.updateOne.mockResolvedValue(user);

      expect(await usersController.updateOne('1', updateUserDto, user)).toBe(
        user,
      );
      expect(mockUsersService.updateOne).toHaveBeenCalledWith(
        '1',
        updateUserDto,
        user,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete and return success response', async () => {
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;
      mockUsersService.deleteOne.mockResolvedValue(successResponse);

      expect(await usersController.deleteOne('1', new UserEntity())).toBe(
        successResponse,
      );
      expect(mockUsersService.deleteOne).toHaveBeenCalledWith(
        '1',
        expect.any(UserEntity),
      );
    });
  });
});
