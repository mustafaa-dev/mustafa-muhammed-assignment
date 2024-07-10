import { Test, TestingModule } from '@nestjs/testing';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionEntity } from '../entites/permission.entity';
import { AddPermissionDto } from '../dtos';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionsService } from '../services/permissions.service';

jest.mock('nestjs-paginate');

describe('PermissionsService', () => {
  let permissionsService: PermissionsService;
  let permissionsRepository: PermissionRepository;

  const mockPermissionsRepository = {
    createQueryBuilder: jest.fn(),
    createOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findAndForceDelete: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PermissionRepository,
          useValue: mockPermissionsRepository,
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionsService>(PermissionsService);
    permissionsRepository =
      module.get<PermissionRepository>(PermissionRepository);
  });

  it('should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of permissions', async () => {
      const query: PaginateQuery = {} as unknown as PaginateQuery;
      const paginatedPermissions: Paginated<PermissionEntity> = {
        data: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
        },
      } as unknown as Paginated<PermissionEntity>;

      (paginate as jest.Mock).mockResolvedValue(paginatedPermissions);

      const qb = { where: jest.fn() } as any;
      jest
        .spyOn(permissionsRepository, 'createQueryBuilder')
        .mockReturnValue(qb);

      const result = await permissionsService.findAll(query);

      expect(result).toEqual(paginatedPermissions);
      expect(permissionsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'permissions',
      );
      expect(paginate).toHaveBeenCalledWith(query, qb, {
        sortableColumns: ['id'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const permission_id = '1' as any;
      const permission: PermissionEntity = {
        id: '1',
        name: 'read',
      } as PermissionEntity;
      jest.spyOn(permissionsService, 'findOne').mockResolvedValue(permission);
      const result = await permissionsService.findOne(permission_id);

      expect(result).toEqual(permission);
    });
  });

  describe('addOne', () => {
    it('should add a new permission', async () => {
      const addPermissionDto: AddPermissionDto = {
        name: 'write',
        description: 'Write permission',
      } as unknown as AddPermissionDto;
      const permission: PermissionEntity = {
        id: '2',
        name: 'write',
        description: 'Write permission',
      } as unknown as PermissionEntity;

      jest
        .spyOn(permissionsRepository, 'createOne')
        .mockResolvedValue(permission);

      const result = await permissionsService.addOne(addPermissionDto);

      expect(result).toEqual(permission);
      expect(permissionsRepository.createOne).toHaveBeenCalledWith(
        expect.objectContaining(addPermissionDto),
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing permission', async () => {
      const permission_id = '1';
      const updatePermissionDto: AddPermissionDto = {
        name: 'write',
        description: 'Write permission updated',
      } as unknown as AddPermissionDto;
      const updatedPermission: PermissionEntity = {
        id: '1',
        name: 'write',
        description: 'Write permission updated',
      } as unknown as PermissionEntity;

      jest
        .spyOn(permissionsService, 'findPermissionById')
        .mockResolvedValue(updatedPermission);
      jest
        .spyOn(permissionsRepository, 'findOneAndUpdate')
        .mockResolvedValue(updatedPermission);

      const result = await permissionsService.updateOne(
        permission_id,
        updatePermissionDto,
      );

      expect(result).toEqual(updatedPermission);
      expect(permissionsService.findPermissionById).toHaveBeenCalledWith(
        permission_id,
      );
      expect(permissionsRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: permission_id } },
        updatePermissionDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a permission', async () => {
      const permission_id = '1';
      const successResponse: ISuccessResponse = { success: true } as any;

      jest
        .spyOn(permissionsRepository, 'findAndForceDelete')
        .mockResolvedValue(successResponse);

      const result = await permissionsService.deleteOne(permission_id);

      expect(result).toEqual(successResponse);
      expect(permissionsRepository.findAndForceDelete).toHaveBeenCalledWith({
        id: permission_id,
      });
    });
  });
});
