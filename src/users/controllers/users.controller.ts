import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@users/services/users.service';
import { UsersControllerInterface } from '@users/interfaces';
import { PaginateQuery } from 'nestjs-paginate';
import { Serialize, SerializePaginated } from '@app/common';
import { AddUserDto, GetUserDto, UpdateUserDto } from '@users/dtos';
import { JwtAuthGuard } from '@auth/guards';
import { PermissionGuard, RoleGuard } from '@auth/guards/permission.guard';
import {
  SetPermissions,
  SetRoles,
} from '@auth/decorators/roles-permissions.decorator';
import { UserRolesEnum } from '@users/enums';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserEntity } from '@users/entites/user.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController implements UsersControllerInterface {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Serialize(GetUserDto)
  async getProfile(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<UserEntity> {
    return this.usersService.getProfile(currentUser);
  }

  @Patch('me')
  @Serialize(GetUserDto)
  async updateProfile(
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateProfile(currentUser, updateUserDto);
  }

  @Get()
  @SetRoles(['admin'])
  @UseGuards(RoleGuard)
  @SerializePaginated(GetUserDto)
  async findAll(@Query() query: PaginateQuery) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetUserDto)
  @SetPermissions(['READ:USER'])
  @UseGuards(PermissionGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Serialize(GetUserDto)
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @UseGuards(RoleGuard)
  async addOne(@Body() addUserDto: AddUserDto) {
    return this.usersService.addOne(addUserDto);
  }

  @Patch(':id')
  @Serialize(GetUserDto)
  @SetPermissions(['UPDATE:USER'])
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @UseGuards(PermissionGuard, RoleGuard)
  async updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Delete(':id')
  @SetPermissions(['DELETE:USER'])
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @UseGuards(PermissionGuard, RoleGuard)
  async deleteOne(@Param('id') id: string): Promise<ISuccessResponse> {
    return await this.usersService.deleteOne(id);
  }
}
