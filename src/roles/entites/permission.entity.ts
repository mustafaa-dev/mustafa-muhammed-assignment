import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { RoleEntity } from './role.entity';

@Entity('permissions')
export class PermissionEntity extends AbstractEntity<PermissionEntity> {
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => RoleEntity, (role) => role.has)
  roles: RoleEntity[];
}
