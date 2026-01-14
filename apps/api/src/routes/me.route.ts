import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/me", authenticate, async (req, res) => {
  const user = (req as AuthenticatedRequest).user!;
  
  const role = await prisma.userRole.findUnique({
    where: { userId: user.id },
  });

  res.json({
    user: user,
    role: role?.role ?? "VIEWER",
  });
});

export default router;
