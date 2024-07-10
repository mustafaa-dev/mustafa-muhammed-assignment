import { forwardRef, Module } from '@nestjs/common';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';
import { DatabaseModule } from '@app/common';
import { TaskEntity } from '@tasks/entites/task.entity';
import { TaskRepository } from '@tasks/repositories/task.repository';
import { UsersModule } from '@users';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule.forFeature([TaskEntity]),
    forwardRef(() => UsersModule),
    EventEmitterModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
  exports: [TasksService],
})
export class TasksModule {}
