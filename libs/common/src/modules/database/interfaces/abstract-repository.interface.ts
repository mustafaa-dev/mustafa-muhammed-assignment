import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { ISuccessResponse } from '../success.interface';

export interface AbstractRepositoryInterface<TEntity extends ObjectLiteral> {
  createOne(entity: TEntity): Promise<TEntity>;

  findOne(where: FindOneOptions<TEntity>): Promise<TEntity>;

  findOneAndUpdate(
    where: FindOneOptions<TEntity>,
    update: Partial<TEntity>,
  ): Promise<TEntity>;

  findAll(where: FindManyOptions<TEntity>): Promise<TEntity[]>;

  findAndForceDelete(
    where: FindOptionsWhere<TEntity>,
  ): Promise<ISuccessResponse>;

  checkOne(where: FindOneOptions<TEntity>): Promise<boolean>;

  createQueryBuilder(alias: string): SelectQueryBuilder<TEntity>;

  saveOne(entity: TEntity): Promise<TEntity>;

  findAndSoftDelete(
    where: FindOptionsWhere<TEntity>,
  ): Promise<ISuccessResponse>;

  restoreSoft(where: any): Promise<ISuccessResponse>;
}
