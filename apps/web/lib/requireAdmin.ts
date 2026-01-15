import { redirect } from "next/navigation";

export function requireAdmin(user: any) {
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }
}
