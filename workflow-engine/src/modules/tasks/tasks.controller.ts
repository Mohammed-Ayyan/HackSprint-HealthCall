import { Request, Response, NextFunction } from "express";
import { taskService, TaskService } from "./tasks.service";
import {
  CreateTaskDTO,
  UpdateTaskStatusDTO,
  ListTasksQueryDTO,
} from "./tasks.types";

export class TaskController {
  private service: TaskService;

  constructor(service: TaskService = taskService) {
    this.service = service;
  }

  createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as CreateTaskDTO;
      const task = await this.service.createTask(payload);
      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const task = await this.service.getTaskById(id);
      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };

  listTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = req.query as unknown as ListTasksQueryDTO;
      const result = await this.service.listTasks(query);
      res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTaskStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id as string;
      const payload = req.body as UpdateTaskStatusDTO;
      const task = await this.service.updateTaskStatus(id, payload);
      res.status(200).json({
        success: true,
        message: `Task status successfully transitioned to '${task.status}'`,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
