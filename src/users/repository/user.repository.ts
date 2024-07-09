import { AbstractRepository } from '@app/common';
import { UserEntity } from '@users/entites/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    em: EntityManager,
  ) {
    super(repository, em, 'User Not Found');
  }
}
