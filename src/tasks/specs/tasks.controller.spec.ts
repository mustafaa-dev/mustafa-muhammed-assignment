import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../services/tasks.service';
import { Paginated, PaginateQuery } from 'nestjs-paginate';
import { TaskEntity } from '../entites/task.entity';
import { AddTaskDto, UpdateTaskDto } from '@tasks/dtos';
import { ISuccessResponse } from '@app/common/modules/database/success.interface';
import { Reflector } from '@nestjs/core';
import { TasksController } from '@tasks/controllers/tasks.controller';

const task: TaskEntity = {
  id: '1',
  title: 'Test Task',
  description: 'Task Description',
} as unknown as TaskEntity;

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    addOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    assignToUser: jest.fn(),
    removeFromUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        Reflector,
      ],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(tasksController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of tasks', async () => {
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

      jest.spyOn(tasksService, 'findAll').mockResolvedValue(paginatedTasks);

      const result = await tasksController.findAll(query);

      expect(result).toEqual(paginatedTasks);
      expect(tasksService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const taskId = '1';
      const task: TaskEntity = {
        id: '1',
        title: 'Test Task',
        description: 'Task Description',
      } as unknown as TaskEntity;

      jest.spyOn(tasksService, 'findOne').mockResolvedValue(task);

      const result = await tasksController.findOne(taskId);

      expect(result).toEqual(task);
      expect(tasksService.findOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe('addOne', () => {
    it('should add a new task', async () => {
      const addTaskDto: AddTaskDto = {
        title: 'Test Task',
        description: 'Task Description',
      };

      jest.spyOn(tasksService, 'addOne').mockResolvedValue(task);

      const result = await tasksController.addOne(addTaskDto);

      expect(result).toEqual(task);
      expect(tasksService.addOne).toHaveBeenCalledWith(addTaskDto);
    });
  });

  describe('updateOne', () => {
    it('should update an existing task', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      } as unknown as UpdateTaskDto;
      const updatedTask: TaskEntity = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
      } as unknown as TaskEntity;

      jest.spyOn(tasksService, 'updateOne').mockResolvedValue(updatedTask);

      const result = await tasksController.updateOne(taskId, updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(tasksService.updateOne).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a task', async () => {
      const taskId = '1';
      const successResponse: ISuccessResponse = {
        success: true,
      } as unknown as ISuccessResponse;

      jest.spyOn(tasksService, 'deleteOne').mockResolvedValue(successResponse);

      const result = await tasksController.deleteOne(taskId);

      expect(result).toEqual(successResponse);
      expect(tasksService.deleteOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe('assignToUser', () => {
    it('should assign a task to a user', async () => {
      const taskId = '1';
      const userId = '2';

      jest.spyOn(tasksService, 'assignToUser').mockResolvedValue(task);

      const result = await tasksController.assignToUser(taskId, userId);

      expect(result).toEqual(task);
      expect(tasksService.assignToUser).toHaveBeenCalledWith(taskId, userId);
    });
  });

  describe('removeFromUser', () => {
    it('should remove a task from a user', async () => {
      const taskId = '1';

      jest.spyOn(tasksService, 'removeFromUser').mockResolvedValue(task);

      const result = await tasksController.removeFromUser(taskId);

      expect(result).toEqual(task);
      expect(tasksService.removeFromUser).toHaveBeenCalledWith(taskId);
    });
  });
});
