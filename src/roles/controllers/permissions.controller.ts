import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { ApiTags } from '@nestjs/swagger';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { PermissionEntity } from '../entites/permission.entity';
import { Serialize, SerializePaginated } from '@app/common';
import { AddPermissionDto, GetPermissionDto } from '../dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { PermissionsControllerInterface } from '../interfaces/permissions-controller.interface';

@ApiTags('Permissions - SuperAdmin')
@Controller('permissions')
export class PermissionsController implements PermissionsControllerInterface {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @SerializePaginated(GetPermissionDto)
  async findAll(
    @Query() query: PaginateQuery,
  ): Promise<Paginated<PermissionEntity>> {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetPermissionDto)
  async findOne(@Param('id') permission_id: string): Promise<PermissionEntity> {
    return this.permissionsService.findOne(permission_id);
  }

  @Post()
  @Serialize(GetPermissionDto)
  async addPermission(
    @Body() addPermissionDto: AddPermissionDto,
  ): Promise<PermissionEntity> {
    return this.permissionsService.addOne(addPermissionDto);
  }

  @Put(':id')
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
  async deletePermission(
    @Param('id') permission_id: string,
  ): Promise<ISuccessResponse> {
    return this.permissionsService.deleteOne(permission_id);
  }
}
