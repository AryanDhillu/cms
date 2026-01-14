import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "./auth.middleware";
import { Role } from "@prisma/client";

export function requireRole(roles: Role[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ code: "UNAUTHORIZED", message: "No user" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Insufficient permissions",
      });
    }

    next();
  };
}
