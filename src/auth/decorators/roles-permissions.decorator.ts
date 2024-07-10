import { SetMetadata } from '@nestjs/common';

export const SetRoles = (roles: string[]) => SetMetadata('roles', roles);

export const SetPermissions = (permissions: string[]) =>
  SetMetadata('permissions', permissions);
