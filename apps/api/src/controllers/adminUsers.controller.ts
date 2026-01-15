import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { supabaseAdmin } from "../lib/supabaseAdmin";
import { Role } from "@prisma/client";

export async function createCmsUser(req: Request, res: Response) {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({
      message: "email and role are required",
    });
  }

  if (!["ADMIN", "EDITOR"].includes(role)) {
    return res.status(400).json({
      message: "Invalid role. Must be ADMIN or EDITOR",
    });
  }

  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Supabase listUsers Error:", error);
      return res.status(500).json({ message: "Supabase error" });
    }

    const supabaseUser = users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!supabaseUser) {
      return res.status(404).json({
        message: "User not found in Supabase Auth",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        message: "User already registered in CMS",
      });
    }

    const cmsUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email,
        role: role as Role,
      },
    });

    return res.status(201).json(cmsUser);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

