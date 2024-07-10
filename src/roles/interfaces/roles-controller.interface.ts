import { AddPermissionDto, AddRoleDto } from '../dtos';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { RoleEntity } from '../entites/role.entity';

export interface RolesControllerInterface {
  findAll(query: PaginateQuery): Promise<Paginated<RoleEntity>>;

  findOne(role_id: string): Promise<RoleEntity>;

  addRole(addRoleDto: AddRoleDto): Promise<RoleEntity>;

  updateRole(
    permission_id: string,
    updatePermissionDto: AddPermissionDto,
  ): Promise<RoleEntity>;

  deleteRole(role_id: string): Promise<ISuccessResponse>;

  assignPermissionToRole(
    role_id: string,
    permission_id: string,
  ): Promise<RoleEntity>;
}
