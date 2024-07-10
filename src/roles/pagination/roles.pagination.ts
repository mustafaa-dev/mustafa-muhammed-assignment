import { PaginateConfig } from 'nestjs-paginate';
import { RoleEntity } from '../entites/role.entity';

export const GetRolesPaginationConfig: PaginateConfig<RoleEntity> = {
  relations: ['has'],
  sortableColumns: ['id', 'created_at'],
  defaultSortBy: [['created_at', 'DESC']],
  searchableColumns: ['name', 'created_at', 'has.name'],
  filterableColumns: {},
};
