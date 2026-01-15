import { Request, Response, NextFunction } from "express";
import { createClient, User, SupabaseClient } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

let supabase: SupabaseClient;

function getSupabase() {
  if (!supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase env vars are missing. Check .env file.");
    }
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabase;
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.replace("Bearer ", "");

  const { data, error } = await getSupabase().auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  (req as AuthenticatedRequest).user = data.user || undefined;

  next();
}
