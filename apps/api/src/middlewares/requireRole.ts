import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "./auth.middleware";

export const requireRole = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const role = userRecord?.role ?? "VIEWER";

    if (!allowedRoles.includes(role)) {
      console.log(`[Authorization] Access denied for user ${userRecord?.email || user.id}. Role: ${role}. Required: ${allowedRoles.join(",")}`);
      return res.status(403).json({ message: "Forbidden" });
    }

    // Attach role to request for later use
    (req as any).role = role;

    next();
  };
};
