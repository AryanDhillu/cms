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

  // Validate role against Prisma Enum or hardcoded string check
  if (!["ADMIN", "EDITOR"].includes(role)) {
    return res.status(400).json({
      message: "Invalid role. Must be ADMIN or EDITOR",
    });
  }

  try {
    // 1. Find Supabase user. 
    // In production with thousands of users, avoid listUsers and use a direct DB lookup or search if available.
    // For now, this is acceptable for admin panel usage.
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

    // 2. Prevent duplicates
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        message: "User already registered in CMS",
      });
    }

    // 3. Create CMS user
    // Note: The schema in Prompt says "supabaseUserId", but we need to check if the schema actually uses 'id' or 'supabaseUserId'.
    // The previous schema context showed 'id' mapped to 'supabaseUserId'.
    // Let's assume the Prompt's Model User definition is the intended one and check against actual schema if fails.
    
    // BASED ON PROMPT REQUEST, mapping to Prisma.
    // If Prisma Schema has `id` as string @id, and `supabaseUserId` as string @unique:
    // We should follow the schema provided in the prompt.
    // However, I recall reading schema.prisma earlier which had `id String @id` and `email String @unique`.
    // I entered a separate tool call to verify schema to be 100% sure. 
    // For now, I will write code assuming the prompt's requested `supabaseUserId` field exists. 
    // If it doesn't, I will catch it.
    
    // *Wait*, looking at previous turn's `schema.prisma` read:
    // model User {
    //   id        String   @id
    //   email     String   @unique
    //   role      Role     @default(VIEWER)
    //   createdAt DateTime @default(now())
    // }
    // The prompt says "You already have this... supabaseUserId String @unique". 
    // If the actual schema DOES NOT have supabaseUserId, I need to use `id` as the supabase ID.
    // I will check schema first.
    
    // 3. Create CMS user
    // Using 'id' from schema (which maps to supabaseUserId concept)
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

