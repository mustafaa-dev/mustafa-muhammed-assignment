import { AddPermissionDto } from '../dtos';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { PermissionEntity } from '../entites/permission.entity';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';

export interface PermissionsControllerInterface {
  findAll(query: PaginateQuery): Promise<Paginated<PermissionEntity>>;

  findOne(permission_id: string): Promise<PermissionEntity>;

  addPermission(addPermissionDto: AddPermissionDto): Promise<PermissionEntity>;

  updatePermission(
    permission_id: string,
    updatePermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity>;

  deletePermission(permission_id: string): Promise<ISuccessResponse>;
}
