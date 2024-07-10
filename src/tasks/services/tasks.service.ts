import { Injectable } from '@nestjs/common';
import { TasksServiceInterface } from '@tasks/interfaces/tasks-service.interface';
import { TaskRepository } from '@tasks/repositories/task.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddTaskDto } from '@tasks/dtos/add-task.dto';
import { UpdateTaskDto } from '@tasks/dtos/update-task.dto';
import { TaskEntity } from '@tasks/entites/task.entity';
import { GetTasksPaginationConfig } from '@tasks/pagination';
import { FindOptionsWhere } from 'typeorm';
import { TaskStatus } from '@tasks/enums';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { UsersService } from '@users/services/users.service';
import { UserEntity } from '@users/entites/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationEvents } from '@app/common';

@Injectable()
export class TasksService implements TasksServiceInterface {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userService: UsersService,
    private readonly ee: EventEmitter2,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<TaskEntity>> {
    const qb = this.taskRepository.createQueryBuilder('task');
    return paginate(query, qb, GetTasksPaginationConfig);
  }

  async findOne(id: string): Promise<TaskEntity> {
    return this.getTaskBy({ id });
  }

  async addOne(addTaskDto: AddTaskDto): Promise<TaskEntity> {
    const newTask = new TaskEntity();
    Object.assign(newTask, { ...addTaskDto, status: TaskStatus.OPEN });
    return this.taskRepository.createOne(newTask);
  }

  async updateOne(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return this.taskRepository.findOneAndUpdate(
      { where: { id } },
      updateTaskDto,
    );
  }

  async deleteOne(id: string): Promise<ISuccessResponse> {
    return this.taskRepository.findAndForceDelete({ id });
  }

  async assignToUser(task_id: string, user_id: string): Promise<TaskEntity> {
    const user: UserEntity = await this.userService.findOne(user_id);
    const task: TaskEntity = await this.getTaskBy({ id: task_id });
    task.owner = user;
    this.ee.emit(NotificationEvents.SEND_TASK_ASSIGNED_NOTIFICATION, {
      to: 'mostafa.mohammed1235@gmail.com',
      data: { taskId: task_id, taskTitle: task.title },
    });
    return await this.taskRepository.saveOne(task);
  }

  async removeFromUser(task_id: string): Promise<TaskEntity> {
    return this.taskRepository.findOneAndUpdate(
      { where: { id: task_id } },
      { owner: null },
    );
  }

  private async getTaskBy(
    where: FindOptionsWhere<TaskEntity>,
  ): Promise<TaskEntity> {
    return this.taskRepository.findOne({ where, relations: ['owner'] });
  }
}
