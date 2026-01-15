import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest } from "./auth.middleware";

export async function populateCmsUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authReq = req as AuthenticatedRequest;
  
  if (!authReq.user) {
     return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const cmsUser = await prisma.user.findUnique({
      where: { id: authReq.user.id },
    });

    if (!cmsUser) {
       (req as any).cmsUser = null;
    } else {
       (req as any).cmsUser = cmsUser;
    }
    
    next();
  } catch (error) {
    console.error("Populate CMS User Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
