import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";

export const assignUserRole = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { role } = req.body;

  if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const updatedRole = await prisma.userRole.upsert({
      where: { userId },
      update: { role: role as Role },
      create: { userId: userId, role: role as Role },
    });

    res.json({ success: true, data: updatedRole });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};
