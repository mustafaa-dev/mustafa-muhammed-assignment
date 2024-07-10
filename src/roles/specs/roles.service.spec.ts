import { Test, TestingModule } from '@nestjs/testing';
import { RoleRepository } from '../repositories/role.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { RoleEntity } from '../entites/role.entity';
import { AddRoleDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionEntity } from '../entites/permission.entity';
import { BadRequestException } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { PermissionsService } from '../services/permissions.service';
import { SelectQueryBuilder } from 'typeorm';

jest.mock('nestjs-paginate');

describe('RolesService', () => {
  let rolesService: RolesService;
  let roleRepository: RoleRepository;
  let permissionsService: PermissionsService;

  const mockRoleRepository = {
    createQueryBuilder: jest.fn(),
    createOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findAndForceDelete: jest.fn(),
    findOne: jest.fn(),
    saveOne: jest.fn(),
  };

  const mockPermissionsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    roleRepository = module.get<RoleRepository>(RoleRepository);
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
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

      (paginate as jest.Mock).mockResolvedValue(paginatedRoles);

      const qb = {
        where: jest.fn(),
      } as unknown as SelectQueryBuilder<RoleEntity>;
      jest.spyOn(roleRepository, 'createQueryBuilder').mockReturnValue(qb);

      const result = await rolesService.findAll(query);

      expect(result).toEqual(paginatedRoles);
      expect(roleRepository.createQueryBuilder).toHaveBeenCalledWith('role');
      expect(paginate).toHaveBeenCalledWith(query, qb, {
        searchableColumns: ['name', 'created_at', 'has.name'],
        sortableColumns: ['id', 'created_at'],
        filterableColumns: {},
        relations: ['has'],
        defaultSortBy: [['created_at', 'DESC']],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      const role_id = '1';
      const role: RoleEntity = { id: '1', name: 'admin', has: [] } as any;

      jest.spyOn(rolesService, 'findPermissionBy').mockResolvedValue(role);

      const result = await rolesService.findOne(role_id);

      expect(result).toEqual(role);
      expect(rolesService.findPermissionBy).toHaveBeenCalledWith({
        id: role_id,
      });
    });
  });

  describe('addOne', () => {
    it('should add a new role', async () => {
      const addRoleDto: AddRoleDto = { name: 'admin' } as unknown as AddRoleDto;
      const role: RoleEntity = {
        id: '2',
        name: 'admin',
        has: [],
      } as unknown as RoleEntity;

      jest.spyOn(roleRepository, 'createOne').mockResolvedValue(role);

      const result = await rolesService.addOne(addRoleDto);

      expect(result).toEqual(role);
      expect(roleRepository.createOne).toHaveBeenCalledWith(
        expect.objectContaining(addRoleDto),
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing role', async () => {
      const role_id = '1';
      const updateRoleDto: AddRoleDto = {
        name: 'superadmin',
      } as unknown as AddRoleDto;
      const updatedRole: RoleEntity = {
        id: '1',
        name: 'superadmin',
        has: [],
      } as unknown as RoleEntity;

      jest
        .spyOn(roleRepository, 'findOneAndUpdate')
        .mockResolvedValue(updatedRole);

      const result = await rolesService.updateOne(role_id, updateRoleDto);

      expect(result).toEqual(updatedRole);
      expect(roleRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: role_id } },
        updateRoleDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a role', async () => {
      const role_id = '1';
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;

      jest
        .spyOn(roleRepository, 'findAndForceDelete')
        .mockResolvedValue(successResponse);

      const result = await rolesService.deleteOne(role_id);

      expect(result).toEqual(successResponse);
      expect(roleRepository.findAndForceDelete).toHaveBeenCalledWith({
        id: role_id,
      });
    });
  });

  describe('addPermissionToRole', () => {
    it('should add a permission to a role', async () => {
      const role_id = '1';
      const permission_id = '2';
      const role: RoleEntity = {
        id: '1',
        name: 'admin',
        has: [],
      } as unknown as RoleEntity;
      const permission: PermissionEntity = {
        id: '2',
        name: 'read',
      } as unknown as PermissionEntity;

      jest.spyOn(rolesService, 'findPermissionBy').mockResolvedValue(role);
      jest.spyOn(permissionsService, 'findOne').mockResolvedValue(permission);
      jest.spyOn(roleRepository, 'saveOne').mockResolvedValue(role);

      const result = await rolesService.addPermissionToRole(
        role_id,
        permission_id,
      );

      expect(result).toEqual(role);
      expect(rolesService.findPermissionBy).toHaveBeenCalledWith({
        id: role_id,
      });
      expect(permissionsService.findOne).toHaveBeenCalledWith(permission_id);
      expect(roleRepository.saveOne).toHaveBeenCalledWith(role);
    });

    it('should throw an error if the permission is already assigned to the role', async () => {
      const role_id = '1';
      const permission_id = '2';
      const role: RoleEntity = {
        id: '1',
        name: 'admin',
        has: [{ id: '2', name: 'read' }],
      } as unknown as RoleEntity;

      jest.spyOn(rolesService, 'findPermissionBy').mockResolvedValue(role);

      await expect(
        rolesService.addPermissionToRole(role_id, permission_id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
