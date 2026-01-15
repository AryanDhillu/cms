import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole";
import { createProgram } from "../controllers/program.controller";
import { assignUserRole, createCMSUser } from "../controllers/user.controller";

const router = Router();

// Content: ADMIN or EDITOR
router.post(
  "/programs",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  createProgram
);

// User Management: ADMIN only
router.post(
  "/admin/users",
  authenticate,
  requireRole(["ADMIN"]),
  createCMSUser
);

router.put(
  "/users/:userId/role",
  authenticate,
  requireRole(["ADMIN"]),
  assignUserRole
);

export default router;
