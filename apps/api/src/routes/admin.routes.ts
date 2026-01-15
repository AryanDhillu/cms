import { Router } from "express";
import { createCmsUser } from "../controllers/adminUsers.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/requireAdmin";
import { populateCmsUser } from "../middlewares/populateCmsUser"; // Need this helper to make requireAdmin work

const router = Router();

router.post(
  "/users",
  authenticate,
  populateCmsUser,
  requireAdmin,
  createCmsUser
);

export default router;
