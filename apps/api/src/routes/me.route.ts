import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middlewares/auth.middleware";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/me", authenticate, async (req, res) => {
  const authUser = (req as AuthenticatedRequest).user!;

  // Authoritative check: User must exist in CMS database
  const cmsUser = await prisma.user.findUnique({
    where: { id: authUser.id }, 
  });

  if (!cmsUser) {
    // ----------------------------------------------------
    // BOOTSTRAP LOGIC: If no users exist, make this user ADMIN
    // ----------------------------------------------------
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

    // [MODIFIED] Auto-onboard subsequent users as VIEWERS (or ADMIN for dev convenience if needed)
    console.log(`[AUTH] User ${authUser.email} not found. Auto-registering as ADMIN (Dev Mode).`);
    const newUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          role: "ADMIN", // TODO: Change to VIEWER in production
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
