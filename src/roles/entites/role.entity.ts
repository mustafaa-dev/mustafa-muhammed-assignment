import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { PermissionEntity } from './permission.entity';
import { UserEntity } from '@users/entites/user.entity';

@Entity('roles')
export class RoleEntity extends AbstractEntity<RoleEntity> {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PermissionEntity, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  has: PermissionEntity[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
