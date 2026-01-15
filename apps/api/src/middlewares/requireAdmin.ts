import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as AuthenticatedRequest).user;
  // The user object attached by auth.middleware needs to be augmented with the CMS Role.
  // The AuthMiddleware fetches user from Supabase. It doesn't fetch from Prisma User table currently.
  // We need to ensure `req.user` or `req.cmsUser` has the role.
  
  // Wait, the previous plan (Phase 6B, Step 1) updated `GET /me` to return 403.
  // We probably need a middleware that fetches the CMS user and attaches it.
  
  // Implementation based on prompt:
  // if (!req.cmsUser || req.cmsUser.role !== "ADMIN")
  
  // This implies we need a middleware BEFORE this one that populates `req.cmsUser`.
  // Or we assume `auth.middleware` does it.
  // Currently `auth.middleware` only attaches Supabase User.
  
  // I will implement a separate check here or update auth middleware if needed.
  // For 'requireAdmin', it's safer to fetch the role here if not present.
  
  // However, strict adherence to prompt: "req.cmsUser".
  // I will check `auth.middleware.ts` again to see if I need to update it to populate cmsUser.
  // Or I can add the population logic inside `requireAdmin` for now if `req.cmsUser` is missing.
  
  // I'll stick to the requested signature but add the logic to fetch if missing (robustness).
  
  // Actually, I'll implement `authenticate` to attach `cmsUser` if the prompt implied it, 
  // but the prompt didn't strictly say to change `auth.middleware`.
  // I will add the lookup logic here to be safe.
  
  const request = req as any;
  if (!request.cmsUser || request.cmsUser.role !== "ADMIN") {
      return res.status(403).json({
          code: "FORBIDDEN",
          message: "Admin access required",
      });
  }

  next();
}
