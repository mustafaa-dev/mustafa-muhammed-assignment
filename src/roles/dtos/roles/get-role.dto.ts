import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GetPermissionDto } from '../permissions';

export class GetRoleDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => GetPermissionDto)
  has: GetPermissionDto[];
}
