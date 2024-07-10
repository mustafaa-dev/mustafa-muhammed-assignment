import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../services/roles.service';
import { RoleEntity } from '../entites/role.entity';
import { AddRoleDto } from '../dtos';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { RolesController } from '../controllers/roles.controller';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;

  const mockRolesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    addOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    addPermissionToRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    rolesController = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(rolesController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of roles', async () => {
      const query: PaginateQuery = {} as unknown as PaginateQuery;
      const paginatedRoles: Paginated<RoleEntity> = {
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
      } as unknown as Paginated<RoleEntity>;

      jest.spyOn(rolesService, 'findAll').mockResolvedValue(paginatedRoles);

      const result = await rolesController.findAll(query);

      expect(result).toEqual(paginatedRoles);
      expect(rolesService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const role_id = '1';
      const role: RoleEntity = {
        id: '1',
        name: 'admin',
        description: 'Admin role',
      } as unknown as RoleEntity;

      jest.spyOn(rolesService, 'findOne').mockResolvedValue(role);

      const result = await rolesController.findOne(role_id);

      expect(result).toEqual(role);
      expect(rolesService.findOne).toHaveBeenCalledWith(role_id);
    });
  });

  describe('addRole', () => {
    it('should add a new role', async () => {
      const addRoleDto: AddRoleDto = {
        name: 'user',
        description: 'User role',
      } as unknown as AddRoleDto;
      const role: RoleEntity = {
        id: '2',
        name: 'user',
        description: 'User role',
      } as unknown as RoleEntity;

      jest.spyOn(rolesService, 'addOne').mockResolvedValue(role);

      const result = await rolesController.addRole(addRoleDto);

      expect(result).toEqual(role);
      expect(rolesService.addOne).toHaveBeenCalledWith(addRoleDto);
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const role_id = '1';
      const updateRoleDto: AddRoleDto = {
        name: 'admin',
        description: 'Admin role updated',
      } as unknown as AddRoleDto;
      const updatedRole: RoleEntity = {
        id: '1',
        name: 'admin',
        description: 'Admin role updated',
      } as unknown as RoleEntity;

      jest.spyOn(rolesService, 'updateOne').mockResolvedValue(updatedRole);

      const result = await rolesController.updateRole(role_id, updateRoleDto);

      expect(result).toEqual(updatedRole);
      expect(rolesService.updateOne).toHaveBeenCalledWith(
        role_id,
        updateRoleDto,
      );
    });
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      const role_id = '1';
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;

      jest.spyOn(rolesService, 'deleteOne').mockResolvedValue(successResponse);

      const result = await rolesController.deleteRole(role_id);

      expect(result).toEqual(successResponse);
      expect(rolesService.deleteOne).toHaveBeenCalledWith(role_id);
    });
  });

  describe('assignPermissionToRole', () => {
    it('should assign a permission to a role', async () => {
      const role_id = '1';
      const permission_id = '2';
      const roleWithPermission: RoleEntity = {
        id: '1',
        name: 'admin',
        description: 'Admin role with permission',
      } as unknown as RoleEntity;

      jest
        .spyOn(rolesService, 'addPermissionToRole')
        .mockResolvedValue(roleWithPermission);

      const result = await rolesController.assignPermissionToRole(
        role_id,
        permission_id,
      );

      expect(result).toEqual(roleWithPermission);
      expect(rolesService.addPermissionToRole).toHaveBeenCalledWith(
        role_id,
        permission_id,
      );
    });
  });
});
