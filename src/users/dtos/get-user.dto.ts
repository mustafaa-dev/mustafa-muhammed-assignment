import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GetRoleDto } from '../../roles/dtos';
import { GetTaskDto } from '@tasks/dtos';

export class GetUserDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => GetRoleDto)
  role: GetRoleDto;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => GetTaskDto)
  tasks: GetTaskDto;

  @Expose()
  created_at: Date;
}
