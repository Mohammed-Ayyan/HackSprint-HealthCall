/**
 * CareOps AI - Appointment Routes
 * 
 * Defines endpoints under /api/v1/appointments with authentication and RBAC.
 */

const express = require("express");
const appointmentController = require("./appointment.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const { USER_ROLES } = require("../config/roles");

const router = express.Router();

router.use(authMiddleware);

// GET /api/v1/appointments
router.get(
  "/",
  requireRole(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.ADMIN,
    USER_ROLES.DEPARTMENT_MANAGER
  ),
  appointmentController.getAppointments
);

// POST /api/v1/appointments
router.post(
  "/",
  requireRole(
    USER_ROLES.PATIENT,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.ADMIN,
    USER_ROLES.DOCTOR
  ),
  appointmentController.createAppointment
);

// PATCH /api/v1/appointments/:id
router.patch(
  "/:id",
  requireRole(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.ADMIN
  ),
  appointmentController.updateAppointment
);

// DELETE /api/v1/appointments/:id
router.delete(
  "/:id",
  requireRole(
    USER_ROLES.PATIENT,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.ADMIN
  ),
  appointmentController.deleteAppointment
);

module.exports = router;
