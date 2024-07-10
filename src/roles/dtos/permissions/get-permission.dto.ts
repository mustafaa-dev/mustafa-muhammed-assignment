import { Expose } from 'class-transformer';

export class GetPermissionDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
