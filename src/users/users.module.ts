import { Module } from '@nestjs/common';
import { UsersController } from '@users/controllers/users.controller';
import { UsersService } from '@users/services/users.service';
import { DatabaseModule } from '@app/common';
import { UserEntity } from '@users/entites/user.entity';
import { UserRepository } from '@users/repository/user.repository';
import { RolesModule } from '../roles';

@Module({
  imports: [DatabaseModule.forFeature([UserEntity]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
