import { IsNotEmpty, IsString } from 'class-validator';

export class AddPermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
