import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '@tasks/enums';

export class UpdateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @IsEnum(TaskStatus, {
    message: `Status must be on of ${Object.values(TaskStatus).join(',')}`,
  })
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  owner_id: string;
}
