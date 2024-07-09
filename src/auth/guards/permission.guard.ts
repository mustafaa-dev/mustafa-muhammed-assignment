import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRole = context.switchToHttp().getRequest().user.role;
    const userPermissions = userRole.has.map((permission) => {
      return permission.name;
    });
    const requiredPermissions =
      this.reflector.get('permissions', context.getHandler()) || [];
    const hasPermissions = requiredPermissions.every((permission: string) =>
      userPermissions.includes(permission),
    );
    if (requiredPermissions.length === 0 || hasPermissions) return true;
    throw new ForbiddenException('No Permission');
  }
}
