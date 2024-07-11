import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { RolesControllerInterface } from '../interfaces/roles-controller.interface';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { RoleEntity } from '../entites/role.entity';
import { AddRoleDto, GetRoleDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { Serialize, SerializePaginated } from '@app/common';
import { JwtAuthGuard } from '@auth/guards';
import { RoleGuard } from '@auth/guards/permission.guard';
import { UserRolesEnum } from '@users/enums';
import { SetRoles } from '@auth/decorators/roles-permissions.decorator';

@ApiTags('Roles - SuperAdmin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('roles')
export class RolesController implements RolesControllerInterface {
  constructor(private readonly roleService: RolesService) {}

  @Get()
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @SerializePaginated(GetRoleDto)
  async findAll(@Query() query: PaginateQuery): Promise<Paginated<RoleEntity>> {
    return this.roleService.findAll(query);
  }

  @Get(':role_id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @Serialize(GetRoleDto)
  async findOne(role_id: string): Promise<RoleEntity> {
    return this.roleService.findOne(role_id);
  }

  @Post()
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  @Serialize(GetRoleDto)
  async addRole(@Body() addRoleDto: AddRoleDto): Promise<RoleEntity> {
    return this.roleService.addOne(addRoleDto);
  }

  @Put(':role_id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  @Serialize(GetRoleDto)
  async updateRole(
    @Param('role_id') role_id: string,
    @Body() updateRoleDto: AddRoleDto,
  ): Promise<RoleEntity> {
    return this.roleService.updateOne(role_id, updateRoleDto);
  }

  @Delete(':role_id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  async deleteRole(
    @Param('role_id') role_id: string,
  ): Promise<ISuccessResponse> {
    return this.roleService.deleteOne(role_id);
  }

  @Patch(':role_id/:permission_id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  @Serialize(GetRoleDto)
  async assignPermissionToRole(
    @Param('role_id') role_id: string,
    @Param('permission_id') permission_id: string,
  ): Promise<RoleEntity> {
    return this.roleService.addPermissionToRole(role_id, permission_id);
  }
}
