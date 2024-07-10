import { AddRoleDto } from '../dtos';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { RoleEntity } from '../entites/role.entity';

export interface RolesServiceInterface {
  findAll(query: PaginateQuery): Promise<Paginated<RoleEntity>>;

  findOne(role_id: string): Promise<RoleEntity>;

  addOne(addRoleDto: AddRoleDto): Promise<RoleEntity>;

  updateOne(role_id: string, updateRoleDto: AddRoleDto): Promise<RoleEntity>;

  deleteOne(role_id: string): Promise<ISuccessResponse>;

  addPermissionToRole(
    role_id: string,
    permission_id: string,
  ): Promise<RoleEntity>;
}
