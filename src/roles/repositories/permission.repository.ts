import { AbstractRepository } from '@app/common';
import { PermissionEntity } from '../entites/permission.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class PermissionRepository extends AbstractRepository<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    repository: Repository<PermissionEntity>,
    readonly em: EntityManager,
  ) {
    super(repository, em, 'Permission Not Found');
  }
}
