import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as AuthenticatedRequest).user;
  
  const request = req as any;
  if (!request.cmsUser || request.cmsUser.role !== "ADMIN") {
      return res.status(403).json({
          code: "FORBIDDEN",
          message: "Admin access required",
      });
  }

  next();
}
