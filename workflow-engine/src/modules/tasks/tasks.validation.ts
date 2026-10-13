import { z } from "zod";
import { TaskStatus, Priority, EscalationLevel } from "@prisma/client";

export const TaskStatusEnum = z.nativeEnum(TaskStatus, {
  errorMap: () => ({
    message:
      "status must be one of: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED",
  }),
});

export const TaskPriorityEnum = z.nativeEnum(Priority, {
  errorMap: () => ({
    message: "priority must be one of: LOW, MEDIUM, HIGH, URGENT",
  }),
});

export const EscalationLevelEnum = z.nativeEnum(EscalationLevel, {
  errorMap: () => ({
    message: "escalationLevel must be one of: NONE, MANAGER, ADMINISTRATOR",
  }),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid Task ID format. Must be a valid UUID."),
});

export const createTaskSchema = z
  .object({
    callId: z.string().uuid("Invalid callId format. Must be a valid UUID.").optional(),
    title: z.string().min(1, "title is required").max(255),
    description: z.string().optional(),
    departmentId: z.string().min(1, "departmentId is required").max(50).optional(),
    assignedEmployeeId: z.string().uuid().optional().nullable(),
    priority: TaskPriorityEnum.optional().default(Priority.MEDIUM),
    deadlineAt: z.coerce.date().optional(),

    // snake_case aliases
    call_id: z.string().uuid().optional(),
    department_id: z.string().min(1).max(50).optional(),
    assigned_employee_id: z.string().uuid().optional().nullable(),
    deadline_at: z.coerce.date().optional(),
  })
  .transform((data) => {
    const callId = data.callId || data.call_id;
    const departmentId = data.departmentId || data.department_id;
    const assignedEmployeeId =
      data.assignedEmployeeId !== undefined
        ? data.assignedEmployeeId
        : data.assigned_employee_id;
    const deadlineAt = data.deadlineAt || data.deadline_at;

    if (!callId) {
      throw new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ["callId"],
          message: "callId is required",
        },
      ]);
    }

    if (!departmentId) {
      throw new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: ["departmentId"],
          message: "departmentId is required",
        },
      ]);
    }

    return {
      callId,
      title: data.title,
      description: data.description,
      departmentId,
      assignedEmployeeId: assignedEmployeeId || undefined,
      priority: data.priority,
      deadlineAt,
    };
  });

export const updateTaskStatusSchema = z
  .object({
    status: TaskStatusEnum,
    reason: z.string().optional(),
    actorId: z.string().uuid().optional().nullable(),
    actor_id: z.string().uuid().optional().nullable(),
  })
  .transform((data) => ({
    status: data.status,
    reason: data.reason,
    actorId: data.actorId || data.actor_id || undefined,
  }));

export const listTasksQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    departmentId: z.string().optional(),
    assignedEmployeeId: z.string().optional(),
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    escalationLevel: EscalationLevelEnum.optional(),
    isOverdue: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === "boolean") return val;
        if (val === "true" || val === "1") return true;
        if (val === "false" || val === "0") return false;
        return undefined;
      }),

    // aliases
    department_id: z.string().optional(),
    assigned_employee_id: z.string().optional(),
    escalation_level: EscalationLevelEnum.optional(),
    is_overdue: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((val) => {
        if (typeof val === "boolean") return val;
        if (val === "true" || val === "1") return true;
        if (val === "false" || val === "0") return false;
        return undefined;
      }),
  })
  .transform((data) => ({
    page: data.page,
    limit: data.limit,
    departmentId: data.departmentId || data.department_id,
    assignedEmployeeId: data.assignedEmployeeId || data.assigned_employee_id,
    status: data.status,
    priority: data.priority,
    escalationLevel: data.escalationLevel || data.escalation_level,
    isOverdue:
      data.isOverdue !== undefined ? data.isOverdue : data.is_overdue,
  }));
