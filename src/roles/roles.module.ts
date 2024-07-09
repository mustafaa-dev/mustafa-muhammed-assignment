import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { DatabaseModule } from '@app/common';
import { RoleEntity } from './entites/role.entity';
import { PermissionRepository } from './repositories/permission.repository';
import { RoleRepository } from './repositories/role.repository';
import { PermissionEntity } from './entites/permission.entity';
import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [DatabaseModule.forFeature([RoleEntity, PermissionEntity])],
  controllers: [RolesController, PermissionsController],
  providers: [
    RolesService,
    PermissionsService,
    RoleRepository,
    PermissionRepository,
  ],
})
export class RolesModule {}
