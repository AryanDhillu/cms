import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";
import { supabaseAdmin } from "../lib/supabase";

export const assignUserRole = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { role } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Update role in User table (authoritative source)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update Role Error:", error);
    res.status(500).json({ message: "Failed to update role" });
  }
};


export const createCMSUser = async (req: Request, res: Response) => {
  const { email, role, password } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Note: This is an expensive operation if there are many users. 
    // In production with thousands of users, a direct DB lookup or search index is better.
    const { data, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000, 
    });

    if (authError || !data.users) {
      console.error("Supabase listUsers error:", authError);
      return res.status(500).json({ message: "Failed to fetch users from auth provider" });
    }

    const availableEmails = data.users.map((u) => u.email);
    console.log(`[CreateUser] Searching for '${email}' in ${data.users.length} users:`, availableEmails);

    const supabaseUser = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let authUserId = supabaseUser?.id;
    let isNewAuth = false;

    if (!authUserId) {
      console.log(`[CreateUser] User '${email}' not found in Auth. Creating new Auth user...`);
      
      const tempPassword = password || "ChangeMe123!";
      
      // Auto-create the user in Supabase Auth
      const { data: newAuthData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      });

      if (createError || !newAuthData.user) {
        console.error("Failed to auto-create auth user:", createError);
        return res.status(500).json({ message: "Failed to create Supabase Auth user" });
      }

      authUserId = newAuthData.user.id;
      isNewAuth = true;
    }

    // Create Prisma User linked to Supabase ID
    const newUser = await prisma.user.create({
      data: {
        id: authUserId,
        email: email, 
        role: role as Role,
      },
    });

    res.status(201).json({ 
      success: true, 
      user: newUser,
      message: isNewAuth 
        ? `User created with password: ${password ? '***' : 'ChangeMe123!'}` 
        : "User onboarded from existing auth"
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "User already registered in CMS" });
    }
    console.error("Create CMS User error:", error);
    res.status(500).json({ message: "Failed to create CMS user" });
  }
};
