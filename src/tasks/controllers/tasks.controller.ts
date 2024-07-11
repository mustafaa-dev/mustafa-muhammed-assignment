import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksControllerInterface } from '@tasks/interfaces/tasks-controller.interface';
import { TaskEntity } from '@tasks/entites/task.entity';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddTaskDto } from '@tasks/dtos/add-task.dto';
import { UpdateTaskDto } from '@tasks/dtos/update-task.dto';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { TasksService } from '@tasks/services/tasks.service';
import { Serialize, SerializePaginated } from '@app/common';
import { GetTaskDto } from '@tasks/dtos';
import { UserRolesEnum } from '@users/enums';
import {
  SetPermissions,
  SetRoles,
} from '@auth/decorators/roles-permissions.decorator';
import { PermissionGuard, RoleGuard } from '@auth/guards/permission.guard';
import { JwtAuthGuard } from '@auth/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserEntity } from '@users/entites/user.entity';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('tasks')
export class TasksController implements TasksControllerInterface {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @SerializePaginated(GetTaskDto)
  async findAll(@Query() query: PaginateQuery): Promise<Paginated<TaskEntity>> {
    return await this.tasksService.findAll(query);
  }

  @Get(':id')
  @Serialize(GetTaskDto)
  async findOne(@Param('id') id: string): Promise<TaskEntity> {
    return await this.tasksService.findOne(id);
  }

  @Post()
  @SetRoles([
    UserRolesEnum.SUPER_ADMIN,
    UserRolesEnum.ADMIN,
    UserRolesEnum.LEADER,
  ])
  @Serialize(GetTaskDto)
  async addOne(@Body() addTaskDto: AddTaskDto): Promise<TaskEntity> {
    return await this.tasksService.addOne(addTaskDto);
  }

  @Put(':id')
  @Serialize(GetTaskDto)
  async updateOne(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return await this.tasksService.updateOne(id, updateTaskDto, user);
  }

  @Delete(':id')
  @SetRoles([
    UserRolesEnum.SUPER_ADMIN,
    UserRolesEnum.ADMIN,
    UserRolesEnum.LEADER,
  ])
  @SetPermissions(['DELETE:TASKS'])
  @UseGuards(PermissionGuard, RoleGuard)
  async deleteOne(id: string): Promise<ISuccessResponse> {
    return await this.tasksService.deleteOne(id);
  }

  @Put(':task_id/assign/:user_id')
  @SetRoles([
    UserRolesEnum.SUPER_ADMIN,
    UserRolesEnum.ADMIN,
    UserRolesEnum.LEADER,
  ])
  @SetPermissions(['UPDATE:TASKS'])
  @UseGuards(PermissionGuard, RoleGuard)
  @Serialize(GetTaskDto)
  async assignToUser(
    @Param('task_id') task_id: string,
    @Param('user_id') user_id: string,
  ): Promise<TaskEntity> {
    return await this.tasksService.assignToUser(task_id, user_id);
  }

  @Put(':task_id/remove')
  @SetRoles([
    UserRolesEnum.SUPER_ADMIN,
    UserRolesEnum.ADMIN,
    UserRolesEnum.LEADER,
  ])
  @SetPermissions(['UPDATE:TASKS'])
  @UseGuards(PermissionGuard, RoleGuard)
  @Serialize(GetTaskDto)
  async removeFromUser(@Param('task_id') task_id: string): Promise<TaskEntity> {
    return await this.tasksService.removeFromUser(task_id);
  }
}
