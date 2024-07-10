import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesServiceInterface } from '../interfaces/roles-service.interface';
import { RoleRepository } from '../repositories/role.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { RoleEntity } from '../entites/role.entity';
import { AddRoleDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { GetRolesPaginationConfig } from '../pagination';
import { PermissionsService } from './permissions.service';
import { PermissionEntity } from '../entites/permission.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class RolesService implements RolesServiceInterface {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<RoleEntity>> {
    console.log('query', query);
    const qb = this.roleRepository.createQueryBuilder('role');
    return paginate(query, qb, GetRolesPaginationConfig);
  }

  async findOne(role_id: string): Promise<RoleEntity> {
    return this.findPermissionBy({ id: role_id });
  }

  async findOneByName(name: string): Promise<RoleEntity> {
    return this.findPermissionBy({ name });
  }

  async addOne(addRoleDto: AddRoleDto): Promise<RoleEntity> {
    const newRole = new RoleEntity();
    Object.assign(newRole, addRoleDto);
    return await this.roleRepository.createOne(newRole);
  }

  async updateOne(
    role_id: string,
    updateRoleDto: AddRoleDto,
  ): Promise<RoleEntity> {
    return this.roleRepository.findOneAndUpdate(
      { where: { id: role_id } },
      updateRoleDto,
    );
  }

  async deleteOne(role_id: string): Promise<ISuccessResponse> {
    return this.roleRepository.findAndForceDelete({ id: role_id });
  }

  async addPermissionToRole(
    role_id: string,
    permission_id: string,
  ): Promise<RoleEntity> {
    const role: RoleEntity = await this.findPermissionBy({ id: role_id });

    if (role.has.some((permission) => permission.id === permission_id))
      throw new BadRequestException('Permission already assigned to role');

    const permission: PermissionEntity =
      await this.permissionsService.findOne(permission_id);

    role.has.push(permission);
    return this.roleRepository.saveOne(role);
  }

  private findPermissionBy(
    where: FindOptionsWhere<RoleEntity>,
  ): Promise<RoleEntity> {
    return this.roleRepository.findOne({
      where,
      relations: ['has'],
    });
  }
}
