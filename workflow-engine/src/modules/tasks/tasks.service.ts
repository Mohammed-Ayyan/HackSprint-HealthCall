import { TaskRepository, taskRepository as defaultRepo } from "./tasks.repository";
import { TaskStateMachine } from "./tasks.state-machine";
import {
  CreateTaskDTO,
  UpdateTaskStatusDTO,
  ListTasksQueryDTO,
} from "./tasks.types";
import { NotFoundError } from "../../errors/appError";
import { prisma } from "../../db/client";

export class TaskService {
  private repo: TaskRepository;

  constructor(repo: TaskRepository = defaultRepo) {
    this.repo = repo;
  }

  async createTask(data: CreateTaskDTO) {
    // 1. Verify Call exists
    const call = await prisma.call.findUnique({
      where: { id: data.callId },
      select: { id: true },
    });
    if (!call) {
      throw new NotFoundError(`Call with ID '${data.callId}' not found`);
    }

    // 2. Verify Department exists
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
      select: { id: true },
    });
    if (!department) {
      throw new NotFoundError(
        `Department with ID '${data.departmentId}' not found`
      );
    }

    // 3. Verify Employee exists if assigned
    if (data.assignedEmployeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: data.assignedEmployeeId },
        select: { id: true, departmentId: true, isActive: true },
      });
      if (!employee) {
        throw new NotFoundError(
          `Employee with ID '${data.assignedEmployeeId}' not found`
        );
      }
    }

    return this.repo.create(data);
  }

  async getTaskById(id: string) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }
    return task;
  }

  async listTasks(query: ListTasksQueryDTO) {
    const { tasks, total } = await this.repo.findMany(query);
    const totalPages = Math.ceil(total / query.limit) || 1;

    return {
      data: tasks,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1,
      },
    };
  }

  async updateTaskStatus(id: string, update: UpdateTaskStatusDTO) {
    // 1. Fetch current task
    const currentTask = await this.repo.findById(id);
    if (!currentTask) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    // 2. Enforce Task State Machine Governance Rules
    TaskStateMachine.validateTransition({
      currentStatus: currentTask.status,
      targetStatus: update.status,
      assignedEmployeeId: currentTask.assignedEmployeeId,
      reason: update.reason,
    });

    // 3. Perform safe state transition
    return this.repo.updateStatus(
      id,
      update.status,
      currentTask.status,
      currentTask.assignedEmployeeId,
      update.reason,
      update.actorId
    );
  }
}

export const taskService = new TaskService();
