import { AddPermissionDto } from '../dtos';
import { PermissionEntity } from '../entites/permission.entity';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';

export interface PermissionsServiceInterface {
  findAll(query: PaginateQuery): Promise<Paginated<PermissionEntity>>;

  findOne(permission_id: string): Promise<PermissionEntity>;

  addOne(addPermissionDto: AddPermissionDto): Promise<PermissionEntity>;

  updateOne(
    permission_id: string,
    updatePermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity>;

  deleteOne(permission_id: string): Promise<ISuccessResponse>;
}
