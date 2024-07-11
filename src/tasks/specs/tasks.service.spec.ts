import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from '../repositories/task.repository';
import { UsersService } from '@users/services/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { TaskEntity } from '../entites/task.entity';
import { AddTaskDto, UpdateTaskDto } from '@tasks/dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { TaskStatus } from '@tasks/enums';
import { UserEntity } from '@users/entites/user.entity';
import { NotificationEvents } from '@app/common';
import { TasksService } from '@tasks/services/tasks.service';
import { UserRolesEnum } from '@users/enums';
import { RoleEntity } from '../../roles/entites/role.entity';

const query: PaginateQuery = {} as unknown as PaginateQuery;

const paginatedTasks: Paginated<TaskEntity> = {
  data: [],
  meta: {
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
  links: {
    first: '',
    previous: '',
    next: '',
    last: '',
  },
} as unknown as Paginated<TaskEntity>;

const task: TaskEntity = {
  id: '1',
  title: 'Test Task',
  description: 'Task Description',
} as unknown as TaskEntity;

const user = new UserEntity();
user.role = { name: UserRolesEnum.SUPER_ADMIN } as unknown as RoleEntity;

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRepository;
  let usersService: UsersService;
  let eventEmitter: EventEmitter2;

  const mockTaskRepository = {
    createQueryBuilder: jest.fn(),
    createOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findAndForceDelete: jest.fn(),
    findOne: jest.fn(),
    saveOne: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    usersService = module.get<UsersService>(UsersService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const taskId = '1';

      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await tasksService.findOne(taskId);

      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['owner'],
      });
    });
  });

  describe('addOne', () => {
    it('should add a new task', async () => {
      const addTaskDto: AddTaskDto = {
        title: 'Test Task',
        description: 'Task Description',
      };

      mockTaskRepository.createOne.mockResolvedValue(task);

      const result = await tasksService.addOne(addTaskDto);

      expect(result).toEqual(task);
      expect(taskRepository.createOne).toHaveBeenCalledWith(
        expect.objectContaining({
          ...addTaskDto,
          status: TaskStatus.OPEN,
        }),
      );
    });
  });

  describe('updateOne', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      } as UpdateTaskDto;
      const updatedTask: TaskEntity = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
      } as TaskEntity;

      mockTaskRepository.findOneAndUpdate.mockResolvedValue(updatedTask);

      const result = await tasksService.updateOne(taskId, updateTaskDto, user);

      expect(result).toEqual(updatedTask);
      expect(taskRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: taskId } },
        updateTaskDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a task', async () => {
      const taskId = '1';
      const successResponse: ISuccessResponse = { success: true } as any;

      mockTaskRepository.findAndForceDelete.mockResolvedValue(successResponse);

      const result = await tasksService.deleteOne(taskId);

      expect(result).toEqual(successResponse);
      expect(taskRepository.findAndForceDelete).toHaveBeenCalledWith({
        id: taskId,
      });
    });
  });

  describe('assignToUser', () => {
    it('should assign a task to a user', async () => {
      const taskId = '1';
      const userId = '2';
      const user: UserEntity = {
        id: '2',
        email: 'mostafa.mohammed1235@gmail.com',
      } as UserEntity;

      mockUsersService.findOne.mockResolvedValue(user);
      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.saveOne.mockResolvedValue({ ...task, owner: user });

      const result = await tasksService.assignToUser(taskId, userId);

      expect(result).toEqual({ ...task, owner: user });
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['owner'],
      });
      expect(taskRepository.saveOne).toHaveBeenCalledWith({
        ...task,
        owner: user,
      });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        NotificationEvents.SEND_TASK_ASSIGNED_NOTIFICATION,
        {
          to: user.email,
          data: { taskId: taskId, taskTitle: task.title },
        },
      );
    });
  });

  describe('removeFromUser', () => {
    it('should remove a task from a user', async () => {
      const taskId = '1';

      mockTaskRepository.findOneAndUpdate.mockResolvedValue(task);

      const result = await tasksService.removeFromUser(taskId);

      expect(result).toEqual(task);
      expect(taskRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { where: { id: taskId } },
        { owner: null },
      );
    });
  });

  describe('getTaskBy', () => {
    it('should return a task by criteria', async () => {
      const taskId = '1';

      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await tasksService['getTaskBy']({ id: taskId });

      expect(result).toEqual(task);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
        relations: ['owner'],
      });
    });
  });
});
