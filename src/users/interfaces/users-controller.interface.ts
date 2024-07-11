import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserEntity } from '@users/entites/user.entity';
import { AddUserDto, UpdateUserDto } from '@users/dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';

export interface UsersControllerInterface {
  addOne(addUserDto: AddUserDto, currentUser: UserEntity): Promise<UserEntity>;

  findAll(query: PaginateQuery): Promise<Paginated<UserEntity>>;

  updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
    currenUser: UserEntity,
  ): Promise<UserEntity>;

  deleteOne(id: string, currenUser: UserEntity): Promise<ISuccessResponse>;

  getProfile(currentUser: UserEntity): Promise<UserEntity>;

  updateProfile(
    currentUser: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity>;
}
