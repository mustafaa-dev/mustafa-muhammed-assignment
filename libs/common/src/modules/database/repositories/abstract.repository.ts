import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AbstractEntity } from '../entities';
import { AbstractRepositoryInterface } from '../interfaces';
import { ISuccessResponse } from '../success.interface';

export abstract class AbstractRepository<
  TEntity extends AbstractEntity<TEntity>,
> implements AbstractRepositoryInterface<TEntity>
{
  protected constructor(
    protected readonly entityRepository: Repository<TEntity>,
    protected readonly entityManager: EntityManager,
    protected notFoundMsg: string,
  ) {}

  async createOne(entity: TEntity): Promise<TEntity> {
    return await this.entityManager.save(entity);
  }

  async findOne(where: FindOneOptions<TEntity>): Promise<TEntity> {
    const entity = await this.entityRepository.findOne(where);
    if (!entity) throw new NotFoundException(this.notFoundMsg);
    return entity;
  }

  async findOneEntity(where: FindOneOptions<TEntity>): Promise<TEntity> {
    return this.entityRepository.findOne(where);
  }

  async findOneAndUpdate(
    where: FindOneOptions<TEntity>,
    update: Partial<TEntity>,
  ): Promise<TEntity> {
    const entity = await this.entityRepository.findOne(where);
    if (!entity) throw new NotFoundException(this.notFoundMsg);
    Object.assign(entity, update);
    return await this.entityRepository.save(entity);
  }

  async findAll(where: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return await this.entityRepository.find(where);
  }

  async findAndForceDelete(
    where: FindOptionsWhere<TEntity>,
  ): Promise<ISuccessResponse> {
    const { affected } = await this.entityRepository.delete(where);
    if (affected <= 0) throw new NotFoundException(`${this.notFoundMsg}`);
    return { status: true, message: 'Deleted Successfully' };
  }

  async checkOne(where: FindOneOptions<TEntity>): Promise<boolean> {
    return await this.entityRepository.exists(where);
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<TEntity> {
    return this.entityRepository.createQueryBuilder(alias);
  }

  async saveOne(entity: TEntity): Promise<TEntity> {
    return await this.entityRepository.save(entity);
  }

  async findAndSoftDelete(
    where: FindOptionsWhere<TEntity>,
  ): Promise<ISuccessResponse> {
    const result = await this.entityRepository.softDelete(where);
    if (result && result.affected != undefined && result.affected <= 0)
      throw new NotFoundException(
        `Error While Soft Deleting , ${this.notFoundMsg}`,
      );
    return { status: true, message: 'Soft Deleted Successfully' };
  }

  async restoreSoft(
    where: FindOptionsWhere<TEntity>,
  ): Promise<ISuccessResponse> {
    const result = await this.entityRepository.restore(where);
    if (result && result.affected != undefined && result.affected <= 0)
      throw new NotFoundException(
        `Error While Restoring , ${this.notFoundMsg}`,
      );
    return { status: true, message: 'Restored Successfully' };
  }
}
