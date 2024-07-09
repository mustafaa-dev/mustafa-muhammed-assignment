import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { TaskStatus } from '@tasks/enums';
import { UserEntity } from '@users/entites/user.entity';

@Entity('tasks')
export class TaskEntity extends AbstractEntity<TaskEntity> {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.tasks)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;
}
