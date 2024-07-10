import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { TaskEntity } from '@tasks/entites/task.entity';

export const GetTasksPaginationConfig: PaginateConfig<TaskEntity> = {
  relations: ['owner'],
  sortableColumns: ['id', 'created_at'],
  defaultSortBy: [['created_at', 'DESC']],
  searchableColumns: [
    'title',
    'created_at',
    'owner.name',
    'description',
    'status',
  ],
  filterableColumns: {
    status: [FilterOperator.EQ],
    'owner.id': [FilterOperator.EQ],
  },
};
