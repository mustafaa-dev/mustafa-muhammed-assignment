import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRolesEnum } from '@users/enums';

export class AddRoleDto {
  @IsEnum(UserRolesEnum, {
    message: `Role must be one of ${Object.values(UserRolesEnum).join(',')}`,
  })
  @IsNotEmpty()
  name: UserRolesEnum;
}
