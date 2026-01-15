import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/me", authenticate, async (req, res) => {
  const authUser = (req as AuthenticatedRequest).user!;

  const cmsUser = await prisma.user.findUnique({
    where: { id: authUser.id }, 
  });

  if (!cmsUser) {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log(`[BOOTSTRAP] Creating first user ${authUser.email} as ADMIN`);
      const newUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          role: "ADMIN",
        },
      });
      
      return res.json({
        user: authUser,
        role: newUser.role,
      });
    }

    console.log(`[AUTH] User ${authUser.email} not found. Auto-registering as ADMIN (Dev Mode).`);
    const newUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          role: "ADMIN",
        },
    });

    return res.json({
      user: authUser,
      role: newUser.role,
    });
  }

  res.json({
    user: authUser,
    role: cmsUser.role,
  });
});

export default router;
