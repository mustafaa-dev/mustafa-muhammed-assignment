import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { TaskEntity } from '@tasks/entites/task.entity';
import { AddTaskDto } from '@tasks/dtos/add-task.dto';
import { UpdateTaskDto } from '@tasks/dtos/update-task.dto';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { UserEntity } from '@users/entites/user.entity';

export interface TasksServiceInterface {
  findAll(query: PaginateQuery): Promise<Paginated<TaskEntity>>;

  findOne(id: string): Promise<TaskEntity>;

  addOne(addTaskDto: AddTaskDto): Promise<TaskEntity>;

  updateOne(
    id: string,
    updateTaskDto: UpdateTaskDto,
    currentUser: UserEntity,
  ): Promise<TaskEntity>;

  deleteOne(id: string): Promise<ISuccessResponse>;

  assignToUser(task_id: string, user_id: string): Promise<TaskEntity>;

  removeFromUser(task_id: string): Promise<TaskEntity>;
}
