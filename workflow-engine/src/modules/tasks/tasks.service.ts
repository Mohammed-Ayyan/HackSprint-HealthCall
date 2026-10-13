import {
  TaskRepository,
  taskRepository as defaultRepo,
} from "./tasks.repository";
import { TaskStateMachine } from "./tasks.state-machine";
import {
  CreateTaskDTO,
  UpdateTaskStatusDTO,
  AssignTaskDTO,
  ChangePriorityDTO,
  CreateTaskNoteDTO,
  ListTasksQueryDTO,
} from "./tasks.types";
import { BadRequestError, NotFoundError } from "../../errors/appError";
import { prisma } from "../../db/client";
import { Priority, TaskStatus } from "@prisma/client";

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
      if (!employee.isActive) {
        throw new BadRequestError("Cannot assign task to an inactive employee");
      }
      if (employee.departmentId !== data.departmentId) {
        throw new BadRequestError(
          `Employee belongs to department '${employee.departmentId}', cannot assign to task in department '${data.departmentId}'`
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
    const currentTask = await this.repo.findById(id);
    if (!currentTask) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    TaskStateMachine.validateTransition({
      currentStatus: currentTask.status,
      targetStatus: update.status,
      assignedEmployeeId: currentTask.assignedEmployeeId,
      reason: update.reason,
    });

    return this.repo.updateStatus(
      id,
      update.status,
      currentTask.status,
      currentTask.assignedEmployeeId,
      update.reason,
      update.actorId
    );
  }

  /**
   * Assigns or transfers a task to a department and/or employee, with auto-assignment support
   */
  async assignTask(id: string, params: AssignTaskDTO) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    if (TaskStateMachine.isTerminal(task.status)) {
      throw new BadRequestError(
        `Cannot assign or transfer a task in terminal state '${task.status}'`
      );
    }

    const targetDeptId = params.departmentId || task.departmentId;

    // Validate target department
    const targetDept = await prisma.department.findUnique({
      where: { id: targetDeptId },
      select: { id: true, name: true },
    });
    if (!targetDept) {
      throw new NotFoundError(`Department with ID '${targetDeptId}' not found`);
    }

    let targetEmployeeId: string | null = null;
    let targetEmployeeName = "";

    // Case A: Auto-assign to least loaded active employee
    if (params.autoAssign) {
      const leastLoaded = await this.repo.findLeastLoadedActiveEmployee(
        targetDeptId
      );
      if (!leastLoaded) {
        throw new BadRequestError(
          `No active employees available in department '${targetDept.name}' (${targetDeptId}) for auto-assignment`
        );
      }
      targetEmployeeId = leastLoaded.id;
      targetEmployeeName = leastLoaded.fullName;
    }
    // Case B: Explicit employeeId passed
    else if (params.employeeId) {
      const employee = await prisma.employee.findUnique({
        where: { id: params.employeeId },
      });
      if (!employee) {
        throw new NotFoundError(
          `Employee with ID '${params.employeeId}' not found`
        );
      }
      if (!employee.isActive) {
        throw new BadRequestError("Cannot assign task to an inactive employee");
      }
      if (employee.departmentId !== targetDeptId) {
        throw new BadRequestError(
          `Employee belongs to department '${employee.departmentId}', but target department is '${targetDeptId}'`
        );
      }
      targetEmployeeId = employee.id;
      targetEmployeeName = employee.fullName;
    }
    // Case C: Department transfer without employee specified (sets task to unassigned PENDING)
    else {
      targetEmployeeId = null;
    }

    const isDepartmentTransfer = targetDeptId !== task.departmentId;
    const isEmployeeTransfer =
      targetEmployeeId !== null && targetEmployeeId !== task.assignedEmployeeId;

    const message = isDepartmentTransfer
      ? `Task transferred to '${targetDept.name}'${
          targetEmployeeName ? ` and assigned to ${targetEmployeeName}` : ""
        }`
      : `Task assigned to ${targetEmployeeName}`;

    return this.repo.assignOrTransfer({
      taskId: id,
      previousDepartmentId: task.departmentId,
      targetDepartmentId: targetDeptId,
      previousEmployeeId: task.assignedEmployeeId,
      targetEmployeeId,
      actorId: params.actorId,
      isTransfer: isDepartmentTransfer || (Boolean(task.assignedEmployeeId) && isEmployeeTransfer),
      message,
    });
  }

  async changePriority(id: string, params: ChangePriorityDTO) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    if (TaskStateMachine.isTerminal(task.status)) {
      throw new BadRequestError(
        `Cannot change priority of a task in terminal state '${task.status}'`
      );
    }

    if (task.priority === params.priority) {
      return task;
    }

    return this.repo.updatePriority(
      id,
      params.priority,
      task.priority,
      params.actorId
    );
  }

  async addNote(id: string, params: CreateTaskNoteDTO) {
    // 1. Validate task
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    // 2. Validate author employee
    const author = await prisma.employee.findUnique({
      where: { id: params.authorId },
      select: { id: true, fullName: true, role: true },
    });
    if (!author) {
      throw new NotFoundError(
        `Author employee with ID '${params.authorId}' not found`
      );
    }

    return this.repo.addNote(id, params.authorId, params.note);
  }

  async listNotes(id: string) {
    const task = await this.repo.findById(id);
    if (!task) {
      throw new NotFoundError(`Task with ID '${id}' not found`);
    }

    return this.repo.listNotes(id);
  }
}

export const taskService = new TaskService();
