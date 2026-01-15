import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/requireRole";
import { 
  createProgram, 
  listPrograms, 
  getProgram, 
  updateProgram,
  publishProgram,
  unpublishProgram 
} from "../controllers/program.controller";
import { 
  createTerm, 
  updateTerm, 
  getTerm 
} from "../controllers/term.controller";
import { 
  createLesson, 
  updateLesson,
  publishLesson,
  unpublishLesson 
} from "../controllers/lesson.controller";
import { assignUserRole, createCMSUser } from "../controllers/user.controller";

const router = Router();

// Content: ADMIN or EDITOR
router.get(
  "/programs",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  listPrograms
);

router.post(
  "/programs",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  createProgram
);

router.get(
  "/programs/:id",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  getProgram
);

router.put(
  "/programs/:id",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  updateProgram
);

router.post(
  "/programs/:id/publish",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  publishProgram
);

router.post(
  "/programs/:id/unpublish",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  unpublishProgram
);

router.post(
  "/programs/:programId/terms",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  createTerm
);

router.put(
  "/terms/:id",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  updateTerm
);

router.get(
  "/terms/:id",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  getTerm
);

router.post(
  "/lessons/:id/publish",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  publishLesson
);

router.post(
  "/lessons/:id/unpublish",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  unpublishLesson
);

router.post(
  "/terms/:termId/lessons",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  createLesson
);

router.put(
  "/lessons/:id",
  authenticate,
  requireRole(["ADMIN", "EDITOR"]),
  updateLesson
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
