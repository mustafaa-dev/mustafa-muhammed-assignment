import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { RoleEntity } from '../../roles/entites/role.entity';
import { TaskEntity } from '@tasks/entites/task.entity';
import { AbstractEntity } from '@app/common';

@Entity('users')
export class UserEntity extends AbstractEntity<UserEntity> {
  @Column({ type: 'varchar', length: 36 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => TaskEntity, (task) => task.owner)
  tasks: TaskEntity[];

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
