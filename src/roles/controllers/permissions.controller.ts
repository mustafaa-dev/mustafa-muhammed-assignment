import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { PermissionEntity } from '../entites/permission.entity';
import { Serialize, SerializePaginated } from '@app/common';
import { AddPermissionDto, GetPermissionDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionsControllerInterface } from '../interfaces';
import { JwtAuthGuard } from '@auth/guards';
import { RoleGuard } from '@auth/guards/permission.guard';
import { SetRoles } from '@auth/decorators/roles-permissions.decorator';
import { UserRolesEnum } from '@users/enums';

@ApiTags('Permissions - SuperAdmin')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('permissions')
export class PermissionsController implements PermissionsControllerInterface {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @SerializePaginated(GetPermissionDto)
  async findAll(
    @Query() query: PaginateQuery,
  ): Promise<Paginated<PermissionEntity>> {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  @Serialize(GetPermissionDto)
  async findOne(@Param('id') permission_id: string): Promise<PermissionEntity> {
    return this.permissionsService.findOne(permission_id);
  }

  @Post()
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  @Serialize(GetPermissionDto)
  async addPermission(
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity> {
    return this.permissionsService.addOne(addPermissionDto);
  }

  @Put(':id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN])
  @Serialize(GetPermissionDto)
  async updatePermission(
    @Param('id') permission_id: string,
    @Body() updatePermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity> {
    return this.permissionsService.updateOne(
      permission_id,
      updatePermissionDto,
    );
  }

  @Delete(':id')
  @SetRoles([UserRolesEnum.SUPER_ADMIN, UserRolesEnum.ADMIN])
  async deletePermission(
    @Param('id') permission_id: string,
  ): Promise<ISuccessResponse> {
    return this.permissionsService.deleteOne(permission_id);
  }
}
