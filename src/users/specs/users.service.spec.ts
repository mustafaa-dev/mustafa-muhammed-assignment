import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../entites/user.entity';
import { AddUserDto, UpdateUserDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { UsersService } from '@users/services/users.service';
import { UserRepository } from '@users/repository/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUsersRepository = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findAndForceDelete: jest.fn(),
    createOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[{}, {}], 2]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const query = { page: 1, limit: 10 } as any;
      const paginatedUsers = {
        data: [
          { id: '1', email: 'test1@test.com' },
          { id: '2', email: 'test2@test.com' },
        ] as UserEntity[],
        meta: {
          totalItems: 2,
          itemCount: 2,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: { first: '', previous: '', next: '', last: '' },
      };

      const result = await service.findAll(query);

      expect(result).toEqual(paginatedUsers);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const userId = '1';
      const user: UserEntity = {
        id: '1',
        email: 'test@test.com',
      } as UserEntity;

      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('addOne', () => {
    it('should add a new user and return it', async () => {
      const addUserDto: AddUserDto = {
        email: 'newuser@test.com',
      } as unknown as AddUserDto;
      const newUser: UserEntity = {
        id: '1',
        email: 'newuser@test.com',
      } as UserEntity;

      mockUsersRepository.createOne.mockResolvedValue(newUser);

      const result = await service.addOne(addUserDto);

      expect(result).toEqual(newUser);
      expect(repository.createOne).toHaveBeenCalledWith(
        expect.objectContaining(addUserDto),
      );
    });
  });

  describe('updateOne', () => {
    it('should update and return a user by ID', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        email: 'updateduser@test.com',
      } as unknown as UpdateUserDto;
      const updatedUser: UserEntity = {
        id: '1',
        email: 'updateduser@test.com',
      } as UserEntity;

      mockUsersRepository.findOneAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.updateOne(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: userId } },
        updateUserDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a user and return success response', async () => {
      const userId = '1';
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;

      mockUsersRepository.findAndForceDelete.mockResolvedValue(successResponse);

      const result = await service.deleteOne(userId);

      expect(result).toEqual(successResponse);
      expect(repository.findAndForceDelete).toHaveBeenCalledWith({
        id: userId,
      });
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const user: UserEntity = {
        id: '1',
        email: 'test@test.com',
      } as UserEntity;

      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.getProfile(user);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
      });
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user profile', async () => {
      const user: UserEntity = {
        id: '1',
        email: 'test@test.com',
      } as UserEntity;
      const updateUserDto: UpdateUserDto = {
        email: 'newemail@test.com',
      } as unknown as UpdateUserDto;
      const updatedUser: UserEntity = {
        id: '1',
        email: 'newemail@test.com',
      } as UserEntity;

      mockUsersRepository.findOneAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(user, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: user.id } },
        updateUserDto,
      );
    });
  });
});
