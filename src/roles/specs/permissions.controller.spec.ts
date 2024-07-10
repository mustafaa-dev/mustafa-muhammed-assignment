import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../services/permissions.service';
import { PermissionEntity } from '../entites/permission.entity';
import { AddPermissionDto } from '../dtos';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionsController } from '../controllers/permissions.controller';

describe('PermissionsController', () => {
  let permissionsController: PermissionsController;
  let permissionsService: PermissionsService;

  const mockPermissionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    addOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    permissionsController = module.get<PermissionsController>(
      PermissionsController,
    );
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(permissionsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of permissions', async () => {
      const query: PaginateQuery = {} as PaginateQuery;
      const paginatedPermissions: Paginated<PermissionEntity> = {
        data: [],
        meta: {
          itemsPerPage: 20,
          totalItems: 21,
          currentPage: 1,
          totalPages: 2,
          sortBy: [['id', 'ASC']],
        },
        links: {
          first: '',
          previous: '',
          next: '',
          last: '',
        },
      } as unknown as Paginated<PermissionEntity>;

      jest
        .spyOn(permissionsService, 'findAll')
        .mockResolvedValue(paginatedPermissions);

      const result = await permissionsController.findAll(query);

      expect(result).toEqual(paginatedPermissions);
      expect(permissionsService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const permission_id = '1';
      const permission: PermissionEntity = {
        id: '1',
        name: 'read',
      } as unknown as PermissionEntity;

      jest.spyOn(permissionsService, 'findOne').mockResolvedValue(permission);

      const result = await permissionsController.findOne(permission_id);

      expect(result).toEqual(permission);
      expect(permissionsService.findOne).toHaveBeenCalledWith(permission_id);
    });
  });

  describe('addPermission', () => {
    it('should add a new permission', async () => {
      const addPermissionDto: AddPermissionDto = {
        name: 'write',
      } as unknown as AddPermissionDto;
      const permission: PermissionEntity = {
        id: '2',
        name: 'write',
        description: 'Write permission',
      } as unknown as PermissionEntity;

      jest.spyOn(permissionsService, 'addOne').mockResolvedValue(permission);

      const result =
        await permissionsController.addPermission(addPermissionDto);

      expect(result).toEqual(permission);
      expect(permissionsService.addOne).toHaveBeenCalledWith(addPermissionDto);
    });
  });

  describe('updatePermission', () => {
    it('should update an existing permission', async () => {
      const permission_id = '1';
      const updatePermissionDto: AddPermissionDto = {
        name: 'write',
      } as unknown as AddPermissionDto;

      const updatedPermission: PermissionEntity = {
        id: '1',
        name: 'write',
      } as unknown as PermissionEntity;

      jest
        .spyOn(permissionsService, 'updateOne')
        .mockResolvedValue(updatedPermission);

      const result = await permissionsController.updatePermission(
        permission_id,
        updatePermissionDto,
      );

      expect(result).toEqual(updatedPermission);
      expect(permissionsService.updateOne).toHaveBeenCalledWith(
        permission_id,
        updatePermissionDto,
      );
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission', async () => {
      const permission_id = '1';
      const successResponse: ISuccessResponse = {
        message: 'Permission deleted successfully',
      } as unknown as ISuccessResponse;

      jest
        .spyOn(permissionsService, 'deleteOne')
        .mockResolvedValue(successResponse);

      const result =
        await permissionsController.deletePermission(permission_id);

      expect(result).toEqual(successResponse);
      expect(permissionsService.deleteOne).toHaveBeenCalledWith(permission_id);
    });
  });
});
