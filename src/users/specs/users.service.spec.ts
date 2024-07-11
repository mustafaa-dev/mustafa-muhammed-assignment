import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@users/repository/user.repository';
import { RolesService } from '../../roles/services/roles.service';
import { AddUserDto, UpdateUserDto } from '@users/dtos';
import { UserRolesEnum } from '@users/enums';
import { ForbiddenException } from '@nestjs/common';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { UsersService } from '@users/services/users.service';
import { UserEntity } from '@users/entites/user.entity';
import { RoleEntity } from '../../roles/entites/role.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let rolesService: RolesService;

  const mockUserRepository = {
    createQueryBuilder: jest.fn(),
    saveOne: jest.fn(),
    findOne: jest.fn(),
    findAndForceDelete: jest.fn(),
  };

  const mockRolesService = {
    findOne: jest.fn(),
    findOneByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new UserEntity();
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);

      expect(await usersService.findOne('1')).toBe(user);
    });
  });

  describe('addOne', () => {
    it('should add and return a new user', async () => {
      const user = new UserEntity();
      user.role = { name: UserRolesEnum.ADMIN } as unknown as RoleEntity;

      const addUserDto = new AddUserDto();
      addUserDto.role_id = '1';
      mockRolesService.findOne.mockResolvedValue({ name: UserRolesEnum.USER });
      mockUserRepository.saveOne.mockResolvedValue(user);

      expect(await usersService.addOne(addUserDto, user)).toBe(user);
    });

    it('should throw ForbiddenException if non-super admin tries to add a super admin', async () => {
      const user = new UserEntity();
      user.role = { id: '1', name: UserRolesEnum.ADMIN } as RoleEntity;

      const addUserDto = new AddUserDto();
      addUserDto.role_id = '2'; // Ensure role_id is set in the DTO

      const superAdminRole = {
        id: '2',
        name: UserRolesEnum.SUPER_ADMIN,
      } as RoleEntity;

      mockRolesService.findOne.mockResolvedValue(superAdminRole);

      await expect(usersService.addOne(addUserDto, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('validate', () => {
    it('should return the user if password matches', async () => {
      const user = new UserEntity();
      user.comparePassword = jest.fn().mockResolvedValue(true);
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await usersService.validate('email', 'password')).toBe(user);
    });

    it('should return undefined if password does not match', async () => {
      const user = new UserEntity();
      user.comparePassword = jest.fn().mockResolvedValue(false);
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await usersService.validate('email', 'password')).toBeUndefined();
    });
  });

  describe('updateOne', () => {
    it('should update and return a user by id', async () => {
      const user = new UserEntity();
      user.role = { name: UserRolesEnum.ADMIN } as unknown as RoleEntity;
      const updateUserDto = new AddUserDto();
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);
      mockRolesService.findOne.mockResolvedValue({
        name: UserRolesEnum.USER,
      } as unknown as RoleEntity);
      mockUserRepository.saveOne.mockResolvedValue(user);

      expect(await usersService.updateOne('1', updateUserDto, user)).toBe(user);
    });

    it('should throw ForbiddenException if non-super admin tries to update to super admin', async () => {
      const user = new UserEntity();
      user.role = { id: '1', name: UserRolesEnum.ADMIN } as RoleEntity;

      const updateUserDto = new AddUserDto();
      updateUserDto.role_id = '2';

      const superAdminRole = {
        id: '2',
        name: UserRolesEnum.SUPER_ADMIN,
      } as RoleEntity;

      mockRolesService.findOne.mockResolvedValue(superAdminRole);
      mockUserRepository.findOne.mockResolvedValue({
        id: '1',
        role: { id: '1', name: UserRolesEnum.ADMIN } as RoleEntity,
      } as UserEntity);

      await expect(
        usersService.updateOne('1', updateUserDto, user),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteOne', () => {
    it('should delete and return success response', async () => {
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;
      const user = new UserEntity();
      user.role = { name: UserRolesEnum.ADMIN } as unknown as RoleEntity;
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);
      mockUserRepository.findAndForceDelete.mockResolvedValue(successResponse);

      expect(await usersService.deleteOne('1', user)).toBe(successResponse);
    });

    it('should throw ForbiddenException if non-super admin tries to delete a super admin', async () => {
      const user = new UserEntity();
      user.role = { name: UserRolesEnum.ADMIN } as any;
      const superAdminUser = new UserEntity();
      superAdminUser.role = { name: UserRolesEnum.SUPER_ADMIN } as any;
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(superAdminUser);

      await expect(usersService.deleteOne('1', user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const user = new UserEntity();
      mockUserRepository.findOne.mockResolvedValue(user);

      expect(await usersService.getProfile(user)).toBe(user);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user profile', async () => {
      const user = new UserEntity();
      const updateUserDto = new UpdateUserDto();
      jest.spyOn(usersService, 'findOneBy').mockResolvedValue(user);
      mockRolesService.findOne.mockResolvedValue({ name: UserRolesEnum.USER });
      mockUserRepository.saveOne.mockResolvedValue(user);

      expect(await usersService.updateProfile(user, updateUserDto)).toBe(user);
    });
  });
});
