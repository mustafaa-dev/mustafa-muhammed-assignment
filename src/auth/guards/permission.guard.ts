import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PermissionEntity } from '../../roles/entites/permission.entity';
import { UserRolesEnum } from '@users/enums';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRole = context.switchToHttp().getRequest().user.role;
    const userPermissions = userRole.has.map((permission: PermissionEntity) => {
      return permission.name;
    });
    const requiredPermissions =
      this.reflector.get('permissions', context.getHandler()) || [];
    const hasPermissions = requiredPermissions.every((permission: string) =>
      userPermissions.includes(permission),
    );
    if (
      requiredPermissions.length === 0 ||
      hasPermissions ||
      userRole.name === UserRolesEnum.SUPER_ADMIN
    )
      return true;
    throw new ForbiddenException('Your Role Has No Sufficient Permissions');
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const userRole = context.switchToHttp().getRequest().user.role.name;

    const requiredRoles =
      this.reflector.get('roles', context.getHandler()) || [];

    if (
      requiredRoles.length === 0 ||
      requiredRoles.includes(userRole) ||
      userRole === UserRolesEnum.SUPER_ADMIN
    )
      return true;
    throw new ForbiddenException('Your Role Has No Access');
  }
}
