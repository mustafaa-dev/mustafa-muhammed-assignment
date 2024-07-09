import { Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { DatabaseModule } from '@app/common';
import { TaskEntity } from '@tasks/entites/task.entity';
import { TaskRepository } from '@tasks/repositories/task.repository';

@Module({
  imports: [DatabaseModule.forFeature([TaskEntity])],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  exports: [TasksService],
})
export class TasksModule {}
