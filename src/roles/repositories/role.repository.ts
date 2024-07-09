import { AbstractRepository } from '@app/common';
import { RoleEntity } from '../entites/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

export class RoleRepository extends AbstractRepository<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity) repository: Repository<RoleEntity>,
    em: EntityManager,
  ) {
    super(repository, em, 'Role Not Found');
  }
}
