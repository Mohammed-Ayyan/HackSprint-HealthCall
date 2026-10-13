/**
 * CareOps AI - Task Service Layer
 * 
 * Implements business logic for task creation, role-based visibility scoping,
 * assignee delegation, and lifecycle transition enforcement.
 */

const Task = require("../models/Task");
const User = require("../models/User");
const Patient = require("../models/Patient");
const { USER_ROLES } = require("../config/roles");
const {
  validateCreateTask,
  validateAssignTask,
  validateStatusTransition,
  normalizeTaskDepartment,
  normalizeTaskPriority,
  normalizeTaskStatus,
} = require("./task.validation");

/**
 * Creates and persists a new operational task in MongoDB.
 */
async function createTask({ payload, requester }) {
  // 1. Role permission guard: Patients cannot create internal tasks
  if (requester && requester.role === USER_ROLES.PATIENT) {
    const error = new Error("Patients do not have permission to create internal operational tasks");
    error.statusCode = 403;
    throw error;
  }

  // 2. Validate & normalize input
  const validated = validateCreateTask(payload);

  // Department-specific creation constraints
  if (requester && requester.role === USER_ROLES.RECEPTIONIST) {
    if (validated.department !== "RECEPTION" && validated.department !== "CLINICAL") {
      const error = new Error("Receptionists can only create tasks in RECEPTION or CLINICAL departments");
      error.statusCode = 403;
      throw error;
    }
  }

  // 3. Verify Patient existence if patientId is provided
  if (validated.patientId) {
    const patientExists = await Patient.findById(validated.patientId);
    if (!patientExists) {
      const error = new Error(`Patient with ID '${validated.patientId}' does not exist`);
      error.statusCode = 404;
      throw error;
    }
  }

  // 4. Verify Assignee existence if assignedTo is provided
  if (validated.assignedTo) {
    const assigneeExists = await User.findById(validated.assignedTo);
    if (!assigneeExists) {
      const error = new Error(`Assigned user with ID '${validated.assignedTo}' does not exist`);
      error.statusCode = 404;
      throw error;
    }
  }

  // 5. Initial status: ASSIGNED if assignee provided, otherwise CREATED
  const initialStatus = validated.assignedTo ? "ASSIGNED" : "CREATED";

  // 6. Instantiate task document
  const newTask = new Task({
    title: validated.title,
    description: validated.description,
    department: validated.department,
    priority: validated.priority,
    status: initialStatus,
    patientId: validated.patientId,
    createdBy: requester ? requester.id : null,
    createdByType: payload.createdByType || (requester ? "USER" : "AI_SYSTEM"),
    assignedTo: validated.assignedTo,
    dueDate: validated.dueDate,
    aiMetadata: payload.aiMetadata || {},
  });

  await newTask.save();

  // 7. Populate relational metadata for consumer
  await newTask.populate([
    { path: "patientId", select: "name email phone mrn department" },
    { path: "createdBy", select: "name email role department" },
    { path: "assignedTo", select: "name email role department" },
  ]);

  return newTask.toJSON();
}

/**
 * Lists tasks strictly filtered by role-based boundaries.
 */
async function listTasks({ requester, filters = {} }) {
  const query = {};

  // 1. Role-based scoping
  if (requester.role === USER_ROLES.PATIENT) {
    // Find patient profile linked to this user
    const patientProfile = await Patient.findOne({
      $or: [
        { userId: requester.id },
        { email: requester.email.toLowerCase() },
      ],
    });

    if (patientProfile) {
      query.$or = [
        { patientId: patientProfile._id },
        { createdBy: requester.id },
      ];
    } else {
      query.createdBy = requester.id;
    }
  } else if (requester.role === USER_ROLES.DOCTOR) {
    query.$or = [
      { assignedTo: requester.id },
      { department: "CLINICAL" },
    ];
  } else if (requester.role === USER_ROLES.RECEPTIONIST) {
    query.$or = [
      { department: "RECEPTION" },
      { assignedTo: requester.id },
    ];
  } else if (requester.role === USER_ROLES.INSURANCE_EMPLOYEE) {
    query.$or = [
      { department: "INSURANCE" },
      { assignedTo: requester.id },
    ];
  } else if (requester.role === USER_ROLES.DEPARTMENT_MANAGER) {
    const normalizedManagerDept = normalizeTaskDepartment(requester.department) || "CLINICAL";
    query.$or = [
      { department: normalizedManagerDept },
      { assignedTo: requester.id },
    ];
  }
  // ADMIN has full access across all tasks

  // 2. Query filters
  if (filters.status) {
    const s = normalizeTaskStatus(filters.status);
    if (s) query.status = s;
  }

  if (filters.priority) {
    const p = normalizeTaskPriority(filters.priority);
    if (p) query.priority = p;
  }

  if (filters.department) {
    const d = normalizeTaskDepartment(filters.department);
    if (d) {
      // Non-admins cannot bypass their department scope
      if (requester.role === USER_ROLES.ADMIN || query.department === d) {
        query.department = d;
      }
    }
  }

  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  const tasks = await Task.find(query)
    .populate("patientId", "name email phone mrn department")
    .populate("createdBy", "name email role department")
    .populate("assignedTo", "name email role department")
    .sort({ createdAt: -1 });

  return tasks.map((t) => t.toJSON());
}

/**
 * Retrieves a single task ensuring caller has permission.
 */
async function getTaskById({ id, requester }) {
  const task = await Task.findById(id)
    .populate("patientId", "name email phone mrn department")
    .populate("createdBy", "name email role department")
    .populate("assignedTo", "name email role department");

  if (!task) {
    const error = new Error(`Task with ID '${id}' not found`);
    error.statusCode = 404;
    throw error;
  }

  // Permission verification
  if (requester.role === USER_ROLES.ADMIN) {
    return task.toJSON();
  }

  if (requester.role === USER_ROLES.PATIENT) {
    const isCreator = task.createdBy && task.createdBy._id.toString() === requester.id;
    let isPatientMatch = false;

    if (task.patientId) {
      const patient = await Patient.findOne({
        $or: [{ userId: requester.id }, { email: requester.email.toLowerCase() }],
      });
      if (patient && task.patientId._id.toString() === patient._id.toString()) {
        isPatientMatch = true;
      }
    }

    if (!isCreator && !isPatientMatch) {
      const error = new Error("You do not have permission to view this task");
      error.statusCode = 403;
      throw error;
    }
    return task.toJSON();
  }

  const isAssigned = task.assignedTo && task.assignedTo._id.toString() === requester.id;

  if (requester.role === USER_ROLES.DOCTOR && (task.department === "CLINICAL" || isAssigned)) {
    return task.toJSON();
  }

  if (requester.role === USER_ROLES.RECEPTIONIST && (task.department === "RECEPTION" || isAssigned)) {
    return task.toJSON();
  }

  if (requester.role === USER_ROLES.INSURANCE_EMPLOYEE && (task.department === "INSURANCE" || isAssigned)) {
    return task.toJSON();
  }

  if (requester.role === USER_ROLES.DEPARTMENT_MANAGER) {
    const mgrDept = normalizeTaskDepartment(requester.department) || "CLINICAL";
    if (task.department === mgrDept || isAssigned) {
      return task.toJSON();
    }
  }

  if (!isAssigned) {
    const error = new Error("You do not have permission to view tasks outside your department");
    error.statusCode = 403;
    throw error;
  }

  return task.toJSON();
}

/**
 * Assigns an existing task to a designated hospital employee.
 * Only ADMIN and DEPARTMENT_MANAGER can assign tasks.
 */
async function assignTask({ id, payload, requester }) {
  if (
    requester.role !== USER_ROLES.ADMIN &&
    requester.role !== USER_ROLES.DEPARTMENT_MANAGER
  ) {
    const error = new Error("Only Administrators and Department Managers can assign tasks");
    error.statusCode = 403;
    throw error;
  }

  const { assignedTo } = validateAssignTask(payload);

  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    const error = new Error(`User with ID '${assignedTo}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const task = await Task.findById(id);
  if (!task) {
    const error = new Error(`Task with ID '${id}' not found`);
    error.statusCode = 404;
    throw error;
  }

  // Department Manager boundary
  if (requester.role === USER_ROLES.DEPARTMENT_MANAGER) {
    const mgrDept = normalizeTaskDepartment(requester.department) || "CLINICAL";
    if (task.department !== mgrDept) {
      const error = new Error("Department Managers can only assign tasks within their department");
      error.statusCode = 403;
      throw error;
    }
  }

  task.assignedTo = assignee._id;
  if (task.status === "CREATED") {
    task.status = "ASSIGNED";
  }

  await task.save();

  await task.populate([
    { path: "patientId", select: "name email phone mrn department" },
    { path: "createdBy", select: "name email role department" },
    { path: "assignedTo", select: "name email role department" },
  ]);

  return task.toJSON();
}

/**
 * Updates the lifecycle status of a task following state machine rules.
 */
async function updateTaskStatus({ id, payload, requester }) {
  if (!payload || !payload.status) {
    const error = new Error("Target status is required");
    error.statusCode = 400;
    throw error;
  }

  // Patients cannot update operational task statuses
  if (requester.role === USER_ROLES.PATIENT) {
    const error = new Error("Patients cannot modify task operational statuses");
    error.statusCode = 403;
    throw error;
  }

  const task = await Task.findById(id);
  if (!task) {
    const error = new Error(`Task with ID '${id}' not found`);
    error.statusCode = 404;
    throw error;
  }

  // Department boundary check
  const isAssigned = task.assignedTo && task.assignedTo.toString() === requester.id;
  if (requester.role !== USER_ROLES.ADMIN && !isAssigned) {
    if (requester.role === USER_ROLES.DOCTOR && task.department !== "CLINICAL") {
      const error = new Error("Doctors can only update clinical tasks or tasks assigned to them");
      error.statusCode = 403;
      throw error;
    }
    if (requester.role === USER_ROLES.RECEPTIONIST && task.department !== "RECEPTION") {
      const error = new Error("Receptionists can only update reception tasks or tasks assigned to them");
      error.statusCode = 403;
      throw error;
    }
    if (requester.role === USER_ROLES.INSURANCE_EMPLOYEE && task.department !== "INSURANCE") {
      const error = new Error("Insurance employees can only update insurance tasks");
      error.statusCode = 403;
      throw error;
    }
    if (requester.role === USER_ROLES.DEPARTMENT_MANAGER) {
      const mgrDept = normalizeTaskDepartment(requester.department) || "CLINICAL";
      if (task.department !== mgrDept) {
        const error = new Error("Department Managers can only update tasks in their department");
        error.statusCode = 403;
        throw error;
      }
    }
  }

  // Validate state machine transition
  const newStatus = validateStatusTransition(task.status, payload.status, requester.role === USER_ROLES.ADMIN);

  task.status = newStatus;
  await task.save();

  await task.populate([
    { path: "patientId", select: "name email phone mrn department" },
    { path: "createdBy", select: "name email role department" },
    { path: "assignedTo", select: "name email role department" },
  ]);

  return task.toJSON();
}

/**
 * Soft deletes a task by updating its status to CLOSED.
 */
async function deleteTask({ id, requester }) {
  if (
    requester.role !== USER_ROLES.ADMIN &&
    requester.role !== USER_ROLES.DEPARTMENT_MANAGER
  ) {
    const error = new Error("Only Administrators and Department Managers can delete or close tasks");
    error.statusCode = 403;
    throw error;
  }

  const task = await Task.findById(id);
  if (!task) {
    const error = new Error(`Task with ID '${id}' not found`);
    error.statusCode = 404;
    throw error;
  }

  if (requester.role === USER_ROLES.DEPARTMENT_MANAGER) {
    const mgrDept = normalizeTaskDepartment(requester.department) || "CLINICAL";
    if (task.department !== mgrDept) {
      const error = new Error("Department Managers can only close tasks in their department");
      error.statusCode = 403;
      throw error;
    }
  }

  task.status = "CLOSED";
  await task.save();

  return true;
}

module.exports = {
  createTask,
  listTasks,
  getTaskById,
  assignTask,
  updateTaskStatus,
  deleteTask,
};
