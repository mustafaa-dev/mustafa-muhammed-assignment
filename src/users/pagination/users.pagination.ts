import { PaginateConfig } from 'nestjs-paginate';
import { UserEntity } from '@users/entites/user.entity';

export const GetUsersPaginationConfig: PaginateConfig<UserEntity> = {
  relations: ['role', 'tasks', 'role.has'],
  sortableColumns: ['id', 'created_at'],
  defaultSortBy: [['created_at', 'DESC']],
  searchableColumns: ['name', 'created_at', 'role.name', 'role.has.name'],
  filterableColumns: {},
};
