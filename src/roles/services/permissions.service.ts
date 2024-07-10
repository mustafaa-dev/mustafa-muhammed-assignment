import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PermissionEntity } from '../entites/permission.entity';
import { AddPermissionDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionsServiceInterface } from '../interfaces/permissions-service.interface';

@Injectable()
export class PermissionsService implements PermissionsServiceInterface {
  constructor(private readonly permissionsRepository: PermissionRepository) {}

  async findAll(query: PaginateQuery): Promise<Paginated<PermissionEntity>> {
    const qb = this.permissionsRepository.createQueryBuilder('permissions');
    return paginate(query, qb, {
      sortableColumns: ['id'],
    });
  }

  async findOne(permission_id: string): Promise<PermissionEntity> {
    return this.findPermissionById(permission_id);
  }

  async addOne(addPermissionDto: AddPermissionDto): Promise<PermissionEntity> {
    const newPermission = new PermissionEntity();
    Object.assign(newPermission, addPermissionDto);
    return this.permissionsRepository.createOne(newPermission);
  }

  async updateOne(
    permission_id: string,
    updatePermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.findPermissionById(permission_id);
    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepository.findOneAndUpdate(
      {
        where: { id: permission_id },
      },
      updatePermissionDto,
    );
  }

  async deleteOne(permission_id: string): Promise<ISuccessResponse> {
    return await this.permissionsRepository.findAndForceDelete({
      id: permission_id,
    });
  }

  findPermissionById(permission_id: string): Promise<PermissionEntity> {
    return this.permissionsRepository.findOne({ where: { id: permission_id } });
  }
}
