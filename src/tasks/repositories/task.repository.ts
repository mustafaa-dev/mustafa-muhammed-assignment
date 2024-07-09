import { AbstractRepository } from '@app/common';
import { TaskEntity } from '@tasks/entites/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class TaskRepository extends AbstractRepository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity) repository: Repository<TaskEntity>,
    em: EntityManager,
  ) {
    super(repository, em, 'Task Not Found');
  }
}
