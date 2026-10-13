/**
 * CareOps AI - Task Management Routes
 * 
 * Endpoints under /api/v1/tasks protected by authMiddleware and requireRole guards.
 */

const express = require("express");
const taskController = require("./task.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/roles");

const router = express.Router();

// Enforce authentication across all task endpoints
router.use(authMiddleware);

// API 1: CREATE TASK
// Internal hospital staff only (Patients are blocked by requireRole and service validation)
router.post(
  "/",
  requireRole(
    USER_ROLES.ADMIN,
    USER_ROLES.DEPARTMENT_MANAGER,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.DOCTOR,
    USER_ROLES.INSURANCE_EMPLOYEE
  ),
  taskController.createTask
);

// API 2: GET TASKS (Role-scoped)
router.get(
  "/",
  requireRole(
    USER_ROLES.ADMIN,
    USER_ROLES.DEPARTMENT_MANAGER,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.INSURANCE_EMPLOYEE,
    USER_ROLES.PATIENT
  ),
  taskController.getTasks
);

// API 3: GET SINGLE TASK
router.get(
  "/:id",
  requireRole(
    USER_ROLES.ADMIN,
    USER_ROLES.DEPARTMENT_MANAGER,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.INSURANCE_EMPLOYEE,
    USER_ROLES.PATIENT
  ),
  taskController.getTask
);

// API 4: ASSIGN TASK (ADMIN & DEPARTMENT_MANAGER only)
router.patch(
  "/:id/assign",
  requireRole(USER_ROLES.ADMIN, USER_ROLES.DEPARTMENT_MANAGER),
  taskController.assignTask
);

// API 5: UPDATE TASK STATUS
router.patch(
  "/:id/status",
  requireRole(
    USER_ROLES.ADMIN,
    USER_ROLES.DEPARTMENT_MANAGER,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.INSURANCE_EMPLOYEE
  ),
  taskController.updateTaskStatus
);

// API 6: DELETE / CLOSE TASK (ADMIN & DEPARTMENT_MANAGER only)
router.delete(
  "/:id",
  requireRole(USER_ROLES.ADMIN, USER_ROLES.DEPARTMENT_MANAGER),
  taskController.deleteTask
);

module.exports = router;
