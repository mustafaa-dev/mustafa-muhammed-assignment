import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { GetUserDto } from '@users/dtos';

export class GetTaskDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => GetUserDto)
  owner: GetUserDto;

  @Expose()
  status: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
