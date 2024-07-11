import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersServiceInterface } from '@users/interfaces';
import { UserRepository } from '@users/repository/user.repository';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserEntity } from '@users/entites/user.entity';
import { GetUsersPaginationConfig } from '@users/pagination';
import { AddUserDto, UpdateUserDto } from '@users/dtos';
import { RolesService } from '../../roles/services/roles.service';
import { UserRolesEnum } from '@users/enums';
import { FindOptionsWhere } from 'typeorm';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { RegisterDto } from '@auth/dtos';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleService: RolesService,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<UserEntity>> {
    const qb = this.userRepository.createQueryBuilder('user');
    return paginate(query, qb, GetUsersPaginationConfig);
  }

  async findOne(id: string): Promise<UserEntity> {
    return this.findOneBy({ id });
  }

  async createOne(user: RegisterDto): Promise<UserEntity> {
    const role = await this.roleService.findOneByName(UserRolesEnum.USER);
    const newUser = new UserEntity();
    Object.assign(newUser, { ...user, role });
    return this.userRepository.saveOne(newUser);
  }

  async addOne(
    addUserDto: AddUserDto,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const role = addUserDto.role_id
      ? await this.roleService.findOne(addUserDto.role_id)
      : await this.roleService.findOneByName(UserRolesEnum.USER);

    if (
      currentUser.role.name !== UserRolesEnum.SUPER_ADMIN &&
      role.name === UserRolesEnum.SUPER_ADMIN
    )
      throw new ForbiddenException(
        'You are not allowed to create a super admin',
      );

    const newUser = new UserEntity();

    Object.assign(newUser, { ...addUserDto, role });

    return this.userRepository.createOne(newUser);
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    console.log(password);
    if (await user.comparePassword(password)) return user;
  }

  async updateOne(
    id: string,
    updateUserDto: AddUserDto,
    currentUser: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.findOneBy({ id });
    const role = updateUserDto.role_id
      ? await this.roleService.findOne(updateUserDto.role_id)
      : user.role;

    if (
      currentUser.role.name !== UserRolesEnum.SUPER_ADMIN &&
      role.name === UserRolesEnum.SUPER_ADMIN
    )
      throw new ForbiddenException(
        'You are not allowed to update a super admin',
      );

    Object.assign(user, { ...updateUserDto, role });

    return this.userRepository.saveOne(user);
  }

  async deleteOne(
    id: string,
    currenUser: UserEntity,
  ): Promise<ISuccessResponse> {
    const user = await this.findOneBy({ id });
    if (
      currenUser.role.name !== UserRolesEnum.SUPER_ADMIN &&
      user.role.name === UserRolesEnum.SUPER_ADMIN
    )
      throw new ForbiddenException(
        'You are not allowed to delete a super admin',
      );
    return await this.userRepository.findAndForceDelete({ id });
  }

  async getProfile(currentUser: UserEntity): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: currentUser.id },
      relations: { role: { has: true }, tasks: true },
    });
  }

  async updateProfile(
    currentUser: UserEntity,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findOneBy({ id: currentUser.id });
    const role = updateUserDto.role_id
      ? await this.roleService.findOne(updateUserDto.role_id)
      : user.role;

    Object.assign(user, { ...updateUserDto, role });

    return this.userRepository.saveOne(user);
  }

  findOneBy(where: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
      relations: ['role', 'role.has'],
    });
  }
}
